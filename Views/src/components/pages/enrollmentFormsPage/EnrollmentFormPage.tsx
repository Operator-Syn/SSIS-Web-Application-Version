import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FormHolder from "../../forms/FormHolder";
import InputForm from "../../forms/InputForm";
import SelectForm from "../../forms/SelectForm";
import HeaderToolbar from "../../forms/HeaderToolbar";
import AlertBanner from "../../alertBanner/AlertBanner";
import FileInput from "../../forms/FileInput";
import { supabase } from "../../../lib/supabaseClient";
import "./EnrollmentFormPage.css";

interface CollegeOption {
    label: string;
    value: string;
    name: string;
}

interface ProgramOption {
    label: string;
    value: string;
    name: string;
    college_code: string;
}

export default function EnrollmentForm() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [yearLevel, setYearLevel] = useState("");
    const [college, setCollege] = useState("");
    const [program, setProgram] = useState("");
    const [idNumber, setIdNumber] = useState("");

    const [collegeOptions, setCollegeOptions] = useState<CollegeOption[]>([]);
    const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [alert, setAlert] = useState({
        show: false,
        type: "info" as "info" | "success" | "danger" | "warning",
        title: "Notice",
        message: "",
        buttons: [] as {
            label: string;
            variant?: string;
            onClick?: () => void;
            closeOnClick?: boolean;
        }[],
    });

    /** Helper to show alerts */
    const showAlert = (
        type: "info" | "success" | "danger" | "warning",
        message: string,
        buttons?: {
            label: string;
            variant?: string;
            onClick?: () => void;
            closeOnClick?: boolean;
        }[],
        title?: string
    ) => {
        setAlert({
            show: true,
            type,
            title: title || "Notice",
            message,
            buttons: buttons || [{ label: "Close", variant: type, closeOnClick: true }],
        });
    };

    /** Load colleges and programs dynamically from backend */
    const loadColleges = async () => {
        try {
            const res = await fetch("/api/colleges");
            const data = await res.json();
            if (Array.isArray(data.rows)) {
                setCollegeOptions(
                    data.rows.map((c: any) => ({
                        label: `${c.college_code} - ${c.college_name}`,
                        value: c.college_code,
                        name: c.college_name,
                    }))
                );
            }
        } catch {
            showAlert("danger", "Failed to load colleges.");
        }
    };

    const loadPrograms = async () => {
        try {
            const res = await fetch("/api/programs");
            const data = await res.json();
            if (Array.isArray(data.rows)) {
                const mapped = data.rows.map((p: any) => ({
                    label: `${p.program_code} - ${p.program_name}`,
                    value: p.program_code,
                    name: p.program_name,
                    college_code: p.college_code,
                }));
                setProgramOptions(mapped);
                setFilteredPrograms(mapped); // initialize
            }
        } catch {
            showAlert("danger", "Failed to load programs.");
        }
    };

    useEffect(() => {
        loadColleges();
        loadPrograms();
        showAlert("info", "You are now in the Enrollment Form.");
    }, []);

    /** When a college is selected */
    const handleSelectCollege = (collegeCode: string) => {
        setCollege(collegeCode);
        const filtered = programOptions.filter(p => p.college_code === collegeCode);
        setFilteredPrograms(filtered);

        // Clear program if it's not under this college
        const selectedProgram = programOptions.find(p => p.value === program);
        if (selectedProgram && selectedProgram.college_code !== collegeCode) {
            setProgram("");
        }
    };

    /** When a program is selected */
    const handleSelectProgram = (programCode: string) => {
        setProgram(programCode);
        const selected = programOptions.find(p => p.value === programCode);
        if (selected) {
            setCollege(selected.college_code);
            setFilteredPrograms(programOptions.filter(p => p.college_code === selected.college_code));
        }
    };

    /** Auto-update filteredPrograms when options change */
    useEffect(() => {
        if (college) {
            setFilteredPrograms(programOptions.filter(p => p.college_code === college));
        } else {
            setFilteredPrograms(programOptions);
        }
    }, [college, programOptions]);

    /** Upload profile picture to Supabase or storage */
    const uploadProfilePicture = async (file: File | null, id: string): Promise<string | null> => {
        if (!file) return null;
        const extension = file.name.split(".").pop();
        if (!extension) return null;
        const fileName = encodeURIComponent(`${id}.${extension}`);

        const { data, error } = await supabase.storage
            .from('profile')
            .upload(`students/${fileName}`, file, { upsert: true });

        console.log("Supabase upload response:", { data, error });

        if (error) {
            showAlert("danger", "Failed to upload profile picture.");
            return null;
        }

        return `students/${fileName}`;
    };

    /** Enroll student */
    const handleEnrollStudent = async () => {
        // Validate required fields
        if (!idNumber || !firstName || !lastName || !gender || !yearLevel || !program || !college) {
            showAlert("warning", "Please fill out all required fields.");
            return;
        }

        // Validate ID number pattern
        const idPattern = /^\d{4}-\d{4}$/;
        if (!idPattern.test(idNumber)) {
            showAlert("warning", "ID must be in the format 1234-5678");
            return; // stop further execution
        }

        // Upload profile picture first
        const profile_image_path = await uploadProfilePicture(profileFile, idNumber);

        // Stop enrollment if upload failed
        if (profileFile && !profile_image_path) {
            // The file was selected but upload failed
            return;
        }

        try {
            const res = await fetch("/api/students/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_number: idNumber,
                    first_name: firstName,
                    middle_name: middleName,
                    last_name: lastName,
                    gender,
                    year_level: parseInt(yearLevel, 10),
                    program_code: program,
                    profile_image_path, // include uploaded file path
                }),
            });

            const data = await res.json();
            showAlert(data.success ? "success" : "danger", data.message);

            if (data.success) {
                setIdNumber("");
                setFirstName("");
                setMiddleName("");
                setLastName("");
                setGender("");
                setYearLevel("");
                setProgram("");
                setCollege("");
                setProfileFile(null);
            }
        } catch {
            showAlert("danger", "Error connecting to the server.");
        }
    };

    const getOptionLabel = (value: string, options: { label: string; value: string }[]) => {
        const option = options.find(o => o.value === value);
        return option ? option.label : "";
    };

    return (
        <div className="enrollment-form-page">
            <HeaderToolbar
                leftText="Enrollment Form"
                rightButtons={[
                    { label: "Update Form", onClick: () => navigate("/student/update") },
                    { label: "Enroll Student", onClick: handleEnrollStudent, className: "btn-progress" },
                ]}
            />

            <AlertBanner
                message={alert.message}
                type={alert.type}
                title={alert.title}
                show={alert.show}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                buttons={alert.buttons}
            />

            <FormHolder>
                <InputForm
                    labels={["First Name"]}
                    value={firstName}
                    onChange={(_, val) => setFirstName(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="First Name cannot be empty"
                />
                <InputForm
                    labels={["Middle Name"]}
                    value={middleName}
                    onChange={(_, val) => setMiddleName(val)}
                />
                <InputForm
                    labels={["Last Name"]}
                    value={lastName}
                    onChange={(_, val) => setLastName(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="Last Name cannot be empty"
                />
                <SelectForm
                    label="Gender"
                    options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                    ]}
                    value={gender}
                    onChange={setGender}
                />
                <SelectForm
                    label="Year Level"
                    options={[1, 2, 3, 4].map(y => ({ label: y.toString(), value: y.toString() }))}
                    value={yearLevel}
                    onChange={setYearLevel}
                />
            </FormHolder>

            <hr className="thick-divider" />

            <FormHolder>
                <SelectForm
                    label="College"
                    options={collegeOptions}
                    value={college}
                    onChange={handleSelectCollege}
                />

                <SelectForm
                    label="Program"
                    options={filteredPrograms}
                    value={program}
                    onChange={handleSelectProgram}
                />
            </FormHolder>

            <hr className="thick-divider" />

            <FormHolder>
                <InputForm
                    labels={["ID Number"]}
                    value={idNumber}
                    onChange={(_, val) => setIdNumber(val)}
                    pattern={/^\d{4}-\d{4}$/}
                    patternMessage="ID must be in the format 1234-5678"
                />

                <FileInput
                    label="Profile Picture"
                    accept="image/*"
                    value={profileFile}
                    onChange={(file) => setProfileFile(file)}
                />
            </FormHolder>

            <hr className="thick-divider" />

            <FormHolder>
                <InputForm
                    labels={["Selected College"]}
                    className="text-center"
                    disabled
                    readOnly
                    value={getOptionLabel(college, collegeOptions)}
                />

                <InputForm
                    labels={["Selected Program"]}
                    className="text-center"
                    disabled
                    readOnly
                    value={getOptionLabel(program, programOptions)}
                />
            </FormHolder>
        </div>
    );
}
