import { useState, useEffect } from "react";
import FormHolder from "../../../forms/FormHolder";
import InputForm from "../../../forms/InputForm";
import SelectForm from "../../../forms/SelectForm";
import HeaderToolbar from "../../../forms/HeaderToolbar";
import AlertBanner from "../../../alertBanner/AlertBanner";

export default function EnrollmentForm() {
    const [programName, setProgramName] = useState("");
    const [programCode, setProgramCode] = useState("");
    const [collegeCode, setCollegeCode] = useState("");

    const [collegeOptions, setCollegeOptions] = useState<
        { label: string; value: string }[]
    >([]);

    const [alert, setAlert] = useState({
        show: false,
        type: "info" as "info" | "success" | "danger" | "warning",
        message: "",
    });

    // Fetch college list for the dropdown
    const loadColleges = async () => {
        try {
            const res = await fetch("/api/colleges");
            const data = await res.json();

            if (Array.isArray(data.rows)) {
                const options = data.rows.map((c: any) => ({
                    label: `${c.college_code} - ${c.college_name}`,
                    value: c.college_code,
                }));
                setCollegeOptions(options);
            } else {
                setAlert({
                    show: true,
                    type: "danger",
                    message: "Failed to load college list.",
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                type: "danger",
                message: "Error fetching college data.",
            });
        }
    };

    useEffect(() => {
        loadColleges();
        setAlert({
            show: true,
            type: "info",
            message: "You are now in the Program Registration Form.",
        });
    }, []);

    // Handle form submission
    const handleRegisterProgram = async () => {
        if (!programCode || !programName || !collegeCode) {
            setAlert({
                show: true,
                type: "warning",
                message: "Please fill out all fields before registering.",
            });
            return;
        }

        try {
            const res = await fetch("/api/programs/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    program_code: programCode,
                    program_name: programName,
                    college_code: collegeCode,
                }),
            });

            const data = await res.json();

            setAlert({
                show: true,
                type: data.success ? "success" : "danger",
                message: data.message,
            });

            if (data.success) {
                // Reset form on success
                setProgramCode("");
                setProgramName("");
                setCollegeCode("");
            }
        } catch (error) {
            setAlert({
                show: true,
                type: "danger",
                message: "Error connecting to the server.",
            });
        }
    };

    return (
        <div className="registerCollege-form-page">
            <HeaderToolbar
                leftText="Program Registration Form"
                rightButtons={[
                    { label: "Register Program", onClick: handleRegisterProgram, className: "btn-progress" },
                ]}
            />

            <AlertBanner
                message={alert.message}
                type={alert.type}
                show={alert.show}
                onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
            />

            <FormHolder>
                <InputForm
                    labels={["Program Name"]}
                    value={programName}
                    onChange={(_, val) => setProgramName(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="Program Name cannot be empty"
                />

                <InputForm
                    labels={["Program Code"]}
                    value={programCode}
                    onChange={(_, val) => setProgramCode(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="Program Code cannot be empty"
                />

                <SelectForm
                    label="Linked College Code"
                    options={collegeOptions}
                    value={collegeCode}
                    onChange={setCollegeCode}
                />
            </FormHolder>
        </div>
    );
}
