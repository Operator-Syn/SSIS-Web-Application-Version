import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import FormHolder from "../../../forms/FormHolder";
import InputForm from "../../../forms/InputForm";
import SelectForm from "../../../forms/SelectForm";
import AlertBanner from "../../../alertBanner/AlertBanner";

interface AddProgramModalProps {
    show: boolean;
    handleClose: () => void;
    onSuccess: () => void;
}

export default function AddProgramModal({ show, handleClose, onSuccess }: AddProgramModalProps) {
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

    // --- 1. Load Data & Reset Form on Open ---
    useEffect(() => {
        if (show) {
            loadColleges();
            // Reset form fields
            setProgramName("");
            setProgramCode("");
            setCollegeCode("");
            setAlert({ show: false, type: "info", message: "" });
        }
    }, [show]);

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

    // --- 2. Handle Submission ---
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

            if (data.success) {
                setAlert({ show: true, type: "success", message: data.message });
                // Delay closing slightly so user sees success message
                setTimeout(() => {
                    onSuccess();
                    handleClose();
                }, 1000);
            } else {
                setAlert({ show: true, type: "danger", message: data.message });
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
        <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Register New Program</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <AlertBanner
                    message={alert.message}
                    type={alert.type}
                    show={alert.show}
                    onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
                />

                <FormHolder>
                    <InputForm
                        labels={["Program Code"]}
                        value={programCode}
                        onChange={(_, val) => setProgramCode(val)}
                        pattern={/^(?!\s*$).+/}
                        patternMessage="Program Code cannot be empty"
                    />

                    <InputForm
                        labels={["Program Name"]}
                        value={programName}
                        onChange={(_, val) => setProgramName(val)}
                        pattern={/^(?!\s*$).+/}
                        patternMessage="Program Name cannot be empty"
                    />

                    <SelectForm
                        label="Linked College"
                        options={collegeOptions}
                        value={collegeCode}
                        onChange={setCollegeCode}
                    />
                </FormHolder>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleRegisterProgram}>
                    Register Program
                </Button>
            </Modal.Footer>
        </Modal>
    );
}