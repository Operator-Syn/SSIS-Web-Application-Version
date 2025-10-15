    import { useNavigate } from "react-router-dom";
    import { useState, useEffect, useRef } from "react";
    import FormHolder from "../../forms/FormHolder";
    import InputForm from "../../forms/InputForm";
    import SelectForm from "../../forms/SelectForm";
    import HeaderToolbar from "../../forms/HeaderToolbar";
    import AlertBanner from "../../alertBanner/AlertBanner";
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

    interface StudentOption {
        id_number: string;
        full_name: string;
    }

    export default function UpdateForm() {
        const navigate = useNavigate();

        // Student fields
        const [firstName, setFirstName] = useState("");
        const [middleName, setMiddleName] = useState("");
        const [lastName, setLastName] = useState("");
        const [gender, setGender] = useState("");
        const [yearLevel, setYearLevel] = useState("");
        const [college, setCollege] = useState("");
        const [program, setProgram] = useState("");
        const [idNumber, setIdNumber] = useState("");

        // Dropdowns and dynamic data
        const [collegeOptions, setCollegeOptions] = useState<CollegeOption[]>([]);
        const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
        const [filteredPrograms, setFilteredPrograms] = useState<ProgramOption[]>([]);
        const [studentList, setStudentList] = useState<StudentOption[]>([]);

        // Lazy-load and debounce
        const [searchQuery, setSearchQuery] = useState("");
        const debounceRef = useRef<NodeJS.Timeout | null>(null);

        // Alert state
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

        /** Load colleges and programs */
        const loadColleges = async () => {
            try {
                const res = await fetch("/api/colleges");
                const data = await res.json();
                if (Array.isArray(data.rows)) {
                    setCollegeOptions(
                        data.rows.map((c: any) => ({
                            label: `${c.college_code} - ${c.college_name}`,
                            value: c.college_code,
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
                        value: p.program_code, // just the code
                        college_code: p.college_code, // used for filtering
                    }));
                    setProgramOptions(mapped);
                    setFilteredPrograms(mapped);
                }
            } catch {
                showAlert("danger", "Failed to load programs.");
            }
        };

        useEffect(() => {
            loadColleges();
            loadPrograms();
            showAlert("info", "You are now in the Update Form.");
        }, []);

        /** Filter programs when a college is selected */
        const handleSelectCollege = (collegeCode: string) => {
            setCollege(collegeCode);
            const filtered = programOptions.filter(p => p.college_code === collegeCode);
            setFilteredPrograms(filtered);

            const selectedProgram = programOptions.find(p => p.value === program);
            if (selectedProgram && selectedProgram.college_code !== collegeCode) {
                setProgram("");
            }
        };

        /** Auto-select college when program is picked */
        const handleSelectProgram = (programCode: string) => {
            setProgram(programCode);
            const selected = programOptions.find(p => p.value === programCode);
            if (selected) {
                setCollege(selected.college_code);
                setFilteredPrograms(programOptions.filter(p => p.college_code === selected.college_code));
            }
        };

        /** Auto-adjust filtered programs when college changes */
        useEffect(() => {
            if (college) {
                setFilteredPrograms(programOptions.filter(p => p.college_code === college));
            } else {
                setFilteredPrograms(programOptions);
            }
        }, [college, programOptions]);

        /** Fetch student by ID using ?q= */
        const handleIdBlur = async () => {
            if (!idNumber.match(/^\d{4}-\d{4}$/)) return;

            try {
                const res = await fetch(`/api/students/search?q=${encodeURIComponent(idNumber)}`);
                const data = await res.json();
                if (!Array.isArray(data.rows) || data.rows.length === 0) throw new Error("Student not found");

                const student = data.rows[0];

                setFirstName(student.first_name || "");
                setMiddleName(student.middle_name || "");
                setLastName(student.last_name || "");
                setGender(student.gender || "");
                setYearLevel(student.year_level?.toString() || "");

                if (student.program_code) {
                    const studentProgramCode = student.program_code.toString();
                    setProgram(studentProgramCode);

                    const programInfo = programOptions.find(p => p.value.toString() === studentProgramCode);

                    if (programInfo) {
                        setCollege(programInfo.college_code);
                        setFilteredPrograms(
                            programOptions.filter(p => p.college_code === programInfo.college_code)
                        );
                    }
                }


                showAlert("success", "Student data loaded successfully!");
            } catch (err) {
                showAlert("danger", "Student not found or failed to load data.");
            }
        };


        /** Update student info */
        const handleUpdate = async () => {
            if (!idNumber || !firstName || !lastName || !gender || !yearLevel || !program || !college) {
                showAlert("warning", "Please fill out all required fields before updating.");
                return;
            }

            try {
                const res = await fetch("/api/students/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_number: idNumber,
                        new_first_name: firstName,
                        new_middle_name: middleName,
                        new_last_name: lastName,
                        new_gender: gender,
                        new_year_level: parseInt(yearLevel, 10),
                        new_program_code: program,
                    }),
                });

                const data = await res.json();
                showAlert(data.success ? "success" : "danger", data.message || "Update failed.");

                if (data.success) {
                    // Reset form fields
                    setIdNumber("");
                    setFirstName("");
                    setMiddleName("");
                    setLastName("");
                    setGender("");
                    setYearLevel("");
                    setCollege("");
                    setProgram("");
                    setFilteredPrograms(programOptions); // reset filtered programs
                    setStudentList([]);
                }
            } catch {
                showAlert("danger", "Error connecting to the server.");
            }
        };

        /** Step 1: Ask for confirmation before delete */
        const handleDelete = () => {
            if (!idNumber) {
                showAlert("warning", "Please enter a student ID to delete.");
                return;
            }

            const studentLabel = studentList.find(s => s.id_number === idNumber)?.full_name || idNumber;

            showAlert(
                "warning",
                `Are you sure you want to delete student ${studentLabel}? This action cannot be undone.`,
                [
                    { label: "Cancel", variant: "secondary", closeOnClick: true },
                    { label: "Delete", variant: "danger", onClick: confirmDelete, closeOnClick: true },
                ],
                "Confirm Deletion"
            );
        };

        /** Step 2: Perform deletion */
        const confirmDelete = async () => {
            try {
                const res = await fetch("/api/students/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_number: idNumber }),
                });

                const data = await res.json();
                showAlert(data.success ? "success" : "danger", data.message || "Delete failed.");

                if (data.success) {
                    // Reset form fields
                    setIdNumber("");
                    setFirstName("");
                    setMiddleName("");
                    setLastName("");
                    setGender("");
                    setYearLevel("");
                    setCollege("");
                    setProgram("");
                    setFilteredPrograms(programOptions); // reset filtered programs
                    setStudentList([]);
                }
            } catch {
                showAlert("danger", "Error connecting to the server.");
            }
        };

        /** Lazy-load students (autocomplete) */
        useEffect(() => {
            if (searchQuery.length < 2) return;
            if (debounceRef.current) clearTimeout(debounceRef.current);

            debounceRef.current = setTimeout(async () => {
                try {
                    const res = await fetch(`/api/students/search?q=${encodeURIComponent(searchQuery)}`);
                    const data = await res.json();
                    if (Array.isArray(data.rows)) {
                        setStudentList(
                            data.rows.map((s: any) => ({
                                id_number: s.id_number,
                                full_name: `${s.last_name}, ${s.first_name} ${s.middle_name || ""}`.trim(),
                            }))
                        );
                    }
                } catch {
                    showAlert("danger", "Failed to load student list.");
                }
            }, 400);
        }, [searchQuery]);

        /** Label helper */
        const getOptionLabel = (value: string, options: { label: string; value: string }[]) => {
            const option = options.find(o => o.value === value);
            return option ? option.label : "";
        };

        return (
            <div className="enrollment-form-page">
                <HeaderToolbar
                    leftText="Update Form"
                    rightButtons={[
                        { label: "Enrollment Form", onClick: () => navigate("/student/enroll") },
                        { label: "Update Information", onClick: handleUpdate, className: "btn-progress" },
                        { label: "Remove Student", onClick: handleDelete, className: "btn-danger" },
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
                    <div className="mb-md-3">
                        <label htmlFor="studentIdInput" className="form-label fw-bold">
                            ID Number
                        </label>
                        <input
                            className="form-control"
                            list="studentOptions"
                            id="studentIdInput"
                            placeholder="Type to search ID or student name..."
                            value={idNumber}
                            onChange={(e) => {
                                const val = e.target.value;
                                setIdNumber(val);
                                setSearchQuery(val);
                            }}
                            onBlur={handleIdBlur}
                        />
                        <datalist id="studentOptions">
                            {studentList.map((s) => (
                                <option key={s.id_number} value={s.id_number}>
                                    {`${s.id_number} - ${s.full_name}`}
                                </option>
                            ))}
                        </datalist>
                    </div>
                </FormHolder>

                <hr className="thick-divider" />

                <FormHolder>
                    <InputForm labels={["First Name"]} value={firstName} onChange={(_, v) => setFirstName(v)} />
                    <InputForm labels={["Middle Name"]} value={middleName} onChange={(_, v) => setMiddleName(v)} />
                    <InputForm labels={["Last Name"]} value={lastName} onChange={(_, v) => setLastName(v)} />
                    <SelectForm
                        label="Gender"
                        options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }]}
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
                    <SelectForm label="College" options={collegeOptions} value={college} onChange={handleSelectCollege} />
                    <SelectForm label="Program" options={filteredPrograms} value={program} onChange={handleSelectProgram} />
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
