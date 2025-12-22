import { useState, useEffect } from "react";
import { Modal, Button, ProgressBar, Spinner } from "react-bootstrap";
import FormHolder from "../../forms/FormHolder";
import InputForm from "../../forms/InputForm";
import SelectForm from "../../forms/SelectForm";
import AlertBanner from "../../alertBanner/AlertBanner";
import FileInput from "../../forms/FileInput";
import { supabase } from "../../../lib/supabaseClient";
import "./EnrollmentFormPage.css";

interface CollegeOption { label: string; value: string; name: string; }
interface ProgramOption { label: string; value: string; name: string; college_code: string; }

interface EnrollmentFormProps { 
    show: boolean; 
    handleClose: () => void; 
    onSuccess: () => void; 
}

export default function EnrollmentForm({ show, handleClose, onSuccess }: EnrollmentFormProps) {

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [yearLevel, setYearLevel] = useState("");
    const [college, setCollege] = useState("");
    const [program, setProgram] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [collegeOptions, setCollegeOptions] = useState<CollegeOption[]>([]);
    const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);

    const [progress, setProgress] = useState(0);
    const [statusLabel, setStatusLabel] = useState("Processing...");

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

    useEffect(() => {
        if (show) {
            loadColleges();
            loadPrograms();
        } else {
            setIdNumber(""); setFirstName(""); setMiddleName(""); setLastName("");
            setGender(""); setYearLevel(""); setProgram(""); setCollege("");
            setProfileFile(null); setProgress(0); setStatusLabel("Processing...");
        }
    }, [show]);

    const loadColleges = async () => {
        try {
            const res = await fetch("/api/colleges");
            const data = await res.json();
            if (Array.isArray(data.rows)) {
                setCollegeOptions(data.rows.map((c: any) => ({ label: `${c.college_code} - ${c.college_name}`, value: c.college_code, name: c.college_name })));
            }
        } catch { showAlert("danger", "Failed to load colleges."); }
    };

    const loadPrograms = async () => {
        try {
            const res = await fetch("/api/programs");
            const data = await res.json();
            if (Array.isArray(data.rows)) {
                const mapped = data.rows.map((p: any) => ({ label: `${p.program_code} - ${p.program_name}`, value: p.program_code, name: p.program_name, college_code: p.college_code }));
                setProgramOptions(mapped);
                setFilteredPrograms(mapped);
            }
        } catch { showAlert("danger", "Failed to load programs."); }
    };

    useEffect(() => {
        if (college) {
            setFilteredPrograms(programOptions.filter(p => p.college_code === college));
            const selectedProgram = programOptions.find(p => p.value === program);
            if (selectedProgram && selectedProgram.college_code !== college) setProgram("");
        } else {
            setFilteredPrograms(programOptions);
        }
    }, [college, programOptions]);

    const handleProgramChange = (val: string) => {
        setProgram(val);
        const selectedProg = programOptions.find(p => p.value === val);
        if (selectedProg) {
            setCollege(selectedProg.college_code);
        }
    };

    const uploadProfilePicture = async (file: File | null, id: string) => {
        if (!file) return null;
        const extension = file.name.split(".").pop();
        const fileName = encodeURIComponent(`${id}.${extension}`);
        const { error } = await supabase.storage.from('profile').upload(`students/${fileName}`, file, { upsert: true });
        return error ? null : `students/${fileName}`;
    };

    const handleEnrollStudent = async () => {
        if (!idNumber || !firstName || !lastName || !gender || !yearLevel || !program || !college) {
            return showAlert("warning", "Please fill out all required fields.");
        }
        if (!/^\d{4}-\d{4}$/.test(idNumber)) {
            return showAlert("warning", "ID must be in the format 1234-5678");
        }

        setProgress(10);
        setStatusLabel("Initializing...");

        try {
            let profile_image_path = undefined;

            if (profileFile) {
                setStatusLabel("Uploading Profile Picture...");
                const uploadTimer = setInterval(() => setProgress(p => (p < 60 ? p + 5 : p)), 200);
                
                profile_image_path = await uploadProfilePicture(profileFile, idNumber);
                clearInterval(uploadTimer);

                if (!profile_image_path) {
                    setProgress(0);
                    return showAlert("danger", "Failed to upload profile picture.");
                }
            }

            setProgress(70);
            setStatusLabel("Saving Student Record...");
            
            const dbTimer = setInterval(() => setProgress(p => (p < 90 ? p + 5 : p)), 100);

            const res = await fetch("/api/students/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_number: idNumber, first_name: firstName, middle_name: middleName,
                    last_name: lastName, gender, year_level: parseInt(yearLevel, 10),
                    program_code: program, profile_image_path,
                }),
            });

            clearInterval(dbTimer);
            const data = await res.json();

            if (data.success) {
                setProgress(100);
                setStatusLabel("Enrollment Complete!");
                showAlert("success", data.message);
                
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            } else {
                setProgress(0);
                showAlert("danger", data.message);
            }
        } catch {
            setProgress(0);
            showAlert("danger", "Error connecting to the server.");
        }
    };

    const isBusy = progress > 0;

    return (
        <>
             <div style={{ position: "relative", zIndex: 1060 }}>
                <AlertBanner 
                    message={alert.message} type={alert.type} title={alert.title} show={alert.show} 
                    onClose={() => setAlert(p => ({ ...p, show: false }))} buttons={alert.buttons} 
                />
            </div>

            <Modal 
                show={show} 
                onHide={isBusy ? undefined : handleClose} 
                fullscreen={true}
                centered 
                scrollable 
                backdrop="static" 
                keyboard={!isBusy}
            >
                <Modal.Header closeButton={!isBusy}>
                    <Modal.Title>Enroll New Student</Modal.Title>
                </Modal.Header>
                <Modal.Body className="enrollment-form-page">
                    
                    {isBusy && (
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-1">
                                <span className="text-primary fw-bold small">{statusLabel}</span>
                                <span className="text-muted small fw-bold">{progress}%</span>
                            </div>
                            <ProgressBar animated now={progress} variant="success" style={{ height: "15px", borderRadius: "8px" }} />
                        </div>
                    )}

                    <fieldset disabled={isBusy}>
                        <FormHolder>
                            <InputForm
                                labels={["ID Number"]} value={idNumber} onChange={(_, val) => setIdNumber(val)}
                                pattern={/^\d{4}-\d{4}$/} patternMessage="Format: 1234-5678"
                            />
                        </FormHolder>
                        <hr className="thick-divider" />
                        <FormHolder>
                            {/* Added pattern so empty value triggers invalid state */}
                            <InputForm 
                                labels={["First Name"]} 
                                value={firstName} 
                                onChange={(_, val) => setFirstName(val)} 
                                pattern={/^(?!\s*$).+/} 
                                patternMessage="First name is required"
                            />
                            
                            <InputForm labels={["Middle Name"]} value={middleName} onChange={(_, val) => setMiddleName(val)} />
                            
                            {/* Added pattern so empty value triggers invalid state */}
                            <InputForm 
                                labels={["Last Name"]} 
                                value={lastName} 
                                onChange={(_, val) => setLastName(val)} 
                                pattern={/^(?!\s*$).+/} 
                                patternMessage="Last name is required"
                            />

                            <SelectForm label="Gender" options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }]} value={gender} onChange={setGender} />
                            <SelectForm label="Year Level" options={[1, 2, 3, 4].map(y => ({ label: y.toString(), value: y.toString() }))} value={yearLevel} onChange={setYearLevel} />
                        </FormHolder>
                        <hr className="thick-divider" />
                        <FormHolder>
                            <SelectForm label="College" options={collegeOptions} value={college} onChange={setCollege} />
                            
                            <SelectForm 
                                label="Program" 
                                options={filteredPrograms} 
                                value={program} 
                                onChange={handleProgramChange} 
                            />
                        </FormHolder>
                        <hr className="thick-divider" />
                        <FormHolder>
                            <FileInput label="Profile Picture" accept="image/*" value={profileFile} onChange={setProfileFile} showAlert={showAlert} maxSizeMB={5} />
                        </FormHolder>
                    </fieldset>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={isBusy}>Cancel</Button>
                    <Button variant="success" onClick={handleEnrollStudent} disabled={isBusy}>
                        {isBusy ? <><Spinner size="sm" animation="border" className="me-2"/>{progress}%</> : "Enroll Student"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}