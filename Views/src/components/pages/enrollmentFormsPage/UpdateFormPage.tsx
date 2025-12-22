import { useState, useEffect, useRef } from "react";
import { Modal, Button, Spinner, ProgressBar } from "react-bootstrap";
import FormHolder from "../../forms/FormHolder";
import InputForm from "../../forms/InputForm";
import SelectForm from "../../forms/SelectForm";
import AlertBanner from "../../alertBanner/AlertBanner";
import FileInput from "../../forms/FileInput";
import { supabase } from "../../../lib/supabaseClient";
import "./EnrollmentFormPage.css";

interface CollegeOption { label: string; value: string; }
interface ProgramOption { label: string; value: string; college_code: string; }
interface StudentOption { id_number: string; full_name: string; }
interface UpdateFormProps { show: boolean; handleClose: () => void; initialId?: string; onSuccess?: () => void; }

export default function UpdateForm({ show, handleClose, initialId, onSuccess }: UpdateFormProps) {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [yearLevel, setYearLevel] = useState("");
    const [college, setCollege] = useState("");
    const [program, setProgram] = useState("");
    const [idNumber, setIdNumber] = useState("");

    // NEW: Separate state for the text label so it's always accurate
    const [statusLabel, setStatusLabel] = useState("Processing...");
    const [progress, setProgress] = useState(0);

    const [collegeOptions, setCollegeOptions] = useState<CollegeOption[]>([]);
    const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
    const [studentList, setStudentList] = useState<StudentOption[]>([]);
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const lastLoadedId = useRef(""); 

    const [alert, setAlert] = useState({
        show: false, type: "info" as "info" | "success" | "danger" | "warning",
        title: "Notice", message: "", buttons: [] as any[],
    });

    const showAlert = (type: any, message: string, buttons?: any[], title?: string) => {
        setAlert({
            show: true, type, title: title || "Notice", message,
            buttons: buttons || [{ label: "Close", variant: type, closeOnClick: true }],
        });
    };

    const loadData = async () => {
        try {
            const [cRes, pRes] = await Promise.all([fetch("/api/colleges"), fetch("/api/programs")]);
            const [cData, pData] = await Promise.all([cRes.json(), pRes.json()]);
            if (cData.rows) setCollegeOptions(cData.rows.map((c: any) => ({ label: `${c.college_code} - ${c.college_name}`, value: c.college_code })));
            if (pData.rows) setProgramOptions(pData.rows.map((p: any) => ({ label: `${p.program_code} - ${p.program_name}`, value: p.program_code, college_code: p.college_code })));
        } catch { showAlert("danger", "Failed to load options."); }
    };

    useEffect(() => {
        if (show) {
            loadData();
        } else {
            lastLoadedId.current = "";
            setIdNumber(""); setFirstName(""); setMiddleName(""); setLastName("");
            setGender(""); setYearLevel(""); setProgram(""); setCollege("");
            setProfileFile(null); setSearchQuery(""); setStudentList([]);
            setProgress(0); 
            setStatusLabel("Processing..."); 
        }
    }, [show]);

    const handleEntered = () => {
        if (initialId) {
            setIdNumber(initialId);
            fetchStudentDetails(initialId);
        }
    };

    const fetchStudentDetails = async (id: string) => {
        if (!id.match(/^\d{4}-\d{4}$/) || id === lastLoadedId.current) return;
        try {
            const res = await fetch(`/api/students/search?q=${encodeURIComponent(id)}`);
            const data = await res.json();
            if (!data.rows?.length) throw new Error();
            const s = data.rows[0];
            lastLoadedId.current = id;
            setFirstName(s.first_name || ""); setMiddleName(s.middle_name || ""); setLastName(s.last_name || "");
            setGender(s.gender || ""); setYearLevel(s.year_level?.toString() || "");
            if (s.program_code) {
                setProgram(s.program_code);
                const pInfo = programOptions.find(p => p.value === s.program_code);
                if (pInfo) setCollege(pInfo.college_code);
            }
            showAlert("success", "Student data loaded!");
        } catch { lastLoadedId.current = ""; showAlert("danger", "Student not found."); }
    };

    const uploadProfilePicture = async (file: File | null, id: string) => {
        if (!file) return null;
        const ext = file.name.split(".").pop();
        
        const { data: files } = await supabase.storage.from('profile').list('students');
        if (files) {
            const old = files.filter(f => f.name.startsWith(id)).map(f => `students/${f.name}`);
            if (old.length) await supabase.storage.from('profile').remove(old);
        }

        const fileName = `students/${encodeURIComponent(`${id}.${ext}`)}`;
        const { error } = await supabase.storage.from('profile').upload(fileName, file, { upsert: true });
        
        return error ? null : fileName;
    };

    const handleUpdate = () => {
        if (!idNumber || !firstName || !lastName || !program) return showAlert("warning", "Fill all required fields.");
        
        showAlert("info", `Update info for ${idNumber}?`, [
            { label: "Cancel", variant: "secondary", closeOnClick: true },
            { 
                label: "Proceed", 
                variant: "primary", 
                onClick: executeUpdate, 
                closeOnClick: true 
            },
        ], "Confirm Update");
    };

    const executeUpdate = async () => {
        // STEP 1: Initialization
        setStatusLabel("Initializing...");
        setProgress(10);
        
        try {
            let path = undefined;
            
            // STEP 2: File Upload
            if (profileFile) {
                setStatusLabel("Uploading Profile Picture..."); // Set Label explicitly
                
                // Cap animation at 65% so it doesn't look 'finished' while waiting
                const uploadTimer = setInterval(() => {
                    setProgress((prev) => (prev < 65 ? prev + 5 : prev));
                }, 200);

                path = await uploadProfilePicture(profileFile, idNumber);
                
                clearInterval(uploadTimer);
                
                if (!path) {
                    setProgress(0);
                    showAlert("danger", "Failed to upload image.");
                    return;
                }
            }
            
            // Upload done, jump to 70%
            setProgress(70);

            // STEP 3: Database Update
            setStatusLabel("Updating Database Record..."); // Set Label explicitly
            
            const payload = { 
                id_number: idNumber, 
                new_first_name: firstName, 
                new_middle_name: middleName, 
                new_last_name: lastName, 
                new_gender: gender, 
                new_year_level: parseInt(yearLevel), 
                new_program_code: program, 
                new_image_path: path
            };

            // Cap animation at 95%
            const dbTimer = setInterval(() => {
                 setProgress((prev) => (prev < 95 ? prev + 2 : prev));
            }, 100);

            const res = await fetch("/api/students/update", { 
                method: "PUT", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(payload) 
            });
            
            clearInterval(dbTimer);
            const data = await res.json();
            
            if (data.success) {
                // STEP 4: Completion
                setStatusLabel("Finalizing...");
                setProgress(100);
                showAlert("success", data.message);
                
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    else handleClose();
                    setProgress(0);
                }, 1000);
            } else {
                setProgress(0);
                showAlert("danger", data.message);
            }
        } catch { 
            setProgress(0);
            showAlert("danger", "Server error."); 
        }
    };

    const handleDelete = () => {
        if (!idNumber) return showAlert("warning", "Enter ID to delete.");
        showAlert("warning", `Delete student ${idNumber}?`, [
            { label: "Cancel", variant: "secondary", closeOnClick: true },
            {
                label: "Delete", variant: "danger", onClick: async () => {
                    setStatusLabel("Deleting Record...");
                    setProgress(50);
                    const res = await fetch("/api/students/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_number: idNumber }) });
                    const data = await res.json();
                    if (data.success) {
                        setProgress(100);
                        setTimeout(() => {
                            if (onSuccess) onSuccess();
                            else handleClose();
                        }, 1000);
                    } else {
                        setProgress(0);
                    }
                }, closeOnClick: true
            },
        ], "Confirm Deletion");
    };

    const isBusy = progress > 0;

    useEffect(() => {
        if (searchQuery.length < 2) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            const res = await fetch(`/api/students/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data.rows) setStudentList(data.rows.map((s: any) => ({ id_number: s.id_number, full_name: `${s.last_name}, ${s.first_name}` })));
        }, 400);
    }, [searchQuery]);

    return (
        <>
            <div style={{ position: "relative", zIndex: 1060 }}>
                <AlertBanner 
                    message={alert.message} 
                    type={alert.type} 
                    title={alert.title} 
                    show={alert.show} 
                    onClose={() => setAlert(p => ({ ...p, show: false }))} 
                    buttons={alert.buttons} 
                />
            </div>

            <Modal 
                show={show} 
                onHide={isBusy ? undefined : handleClose} 
                onEntered={handleEntered}
                size="lg" 
                centered 
                scrollable 
                backdrop={isBusy ? "static" : "static"} 
                keyboard={!isBusy} 
            >
                <Modal.Header closeButton={!isBusy}>
                    <Modal.Title>Update Student Information</Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="enrollment-form-page">
                    {/* VISUAL PROGRESS BAR with explicit Status Label */}
                    {isBusy && (
                        <div className="mb-4">
                             <div className="d-flex justify-content-between mb-1">
                                {/* Use statusLabel here directly instead of calculating logic */}
                                <span className="text-primary fw-bold small">
                                    {statusLabel}
                                </span>
                                <span className="text-muted small fw-bold">{progress}%</span>
                             </div>
                             <ProgressBar 
                                animated 
                                now={progress} 
                                variant="primary" 
                                style={{ height: "15px", borderRadius: "8px" }} 
                             />
                        </div>
                    )}

                    <fieldset disabled={isBusy}>
                        <FormHolder>
                            <div className="mb-md-3">
                                <label className="form-label fw-bold">ID Number</label>
                                <input className="form-control" list="studentOptions" value={idNumber}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchStudentDetails(idNumber)}
                                    onChange={(e) => {
                                        setIdNumber(e.target.value); setSearchQuery(e.target.value);
                                        if (e.target.value.match(/^\d{4}-\d{4}$/)) fetchStudentDetails(e.target.value);
                                    }}
                                    onBlur={() => fetchStudentDetails(idNumber)}
                                />
                                <datalist id="studentOptions">{studentList.map(s => <option key={s.id_number} value={s.id_number}>{s.id_number} - {s.full_name}</option>)}</datalist>
                            </div>
                        </FormHolder>
                        <hr className="thick-divider" />
                        <FormHolder>
                            <InputForm labels={["First Name"]} value={firstName} onChange={(_, v) => setFirstName(v)} />
                            <InputForm labels={["Middle Name"]} value={middleName} onChange={(_, v) => setMiddleName(v)} />
                            <InputForm labels={["Last Name"]} value={lastName} onChange={(_, v) => setLastName(v)} />
                            <SelectForm label="Gender" options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }]} value={gender} onChange={setGender} />
                            <SelectForm label="Year Level" options={[1, 2, 3, 4].map(y => ({ label: y.toString(), value: y.toString() }))} value={yearLevel} onChange={setYearLevel} />
                        </FormHolder>
                        <hr className="thick-divider" />
                        <FormHolder>
                            <SelectForm label="College" options={collegeOptions} value={college} onChange={(val) => { setCollege(val); if (programOptions.find(p => p.value === program)?.college_code !== val) setProgram(""); }} />
                            <FileInput label="Profile Picture" accept="image/*" value={profileFile} onChange={setProfileFile} showAlert={showAlert} maxSizeMB={5} />
                            <SelectForm
                                label="Program"
                                options={programOptions.filter(p => !college || p.college_code === college)}
                                value={program}
                                onChange={(val) => {
                                    setProgram(val);
                                    const selectedProg = programOptions.find(p => p.value === val);
                                    if (selectedProg) {
                                        setCollege(selectedProg.college_code);
                                    }
                                }}
                            />
                        </FormHolder>
                    </fieldset>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="me-auto" onClick={handleDelete} disabled={isBusy}>
                        Remove Student
                    </Button>
                    <Button variant="secondary" onClick={handleClose} disabled={isBusy}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate} disabled={isBusy}>
                        {isBusy ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                                {progress}%
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}