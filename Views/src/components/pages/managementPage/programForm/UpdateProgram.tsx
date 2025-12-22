import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import FormHolder from "../../../forms/FormHolder";
import InputForm from "../../../forms/InputForm";
import SelectForm from "../../../forms/SelectForm";
import AlertBanner from "../../../alertBanner/AlertBanner";

interface UpdateProgramModalProps {
    show: boolean;
    handleClose: () => void;
    program: { 
        programCode: string; 
        programName: string; 
        collegeName?: string; 
        collegeCode?: string; // Optional if you have it, otherwise we map via name
    } | null;
    onSuccess: () => void;
}

export default function UpdateProgramModal({ show, handleClose, program, onSuccess }: UpdateProgramModalProps) {
    // Form State
    const [programName, setProgramName] = useState("");
    const [programCode, setProgramCode] = useState(""); // Read-only ID
    const [collegeCode, setCollegeCode] = useState(""); // Linked ID

    // Data State
    const [collegeOptions, setCollegeOptions] = useState<{ label: string; value: string; name: string }[]>([]);

    // Alert State
    const [alert, setAlert] = useState({
        show: false,
        type: "info" as "info" | "success" | "danger" | "warning",
        title: "Notice",
        message: "",
        buttons: [] as any[],
    });

    const showAlert = (type: any, message: string, buttons?: any[], title?: string) => {
        setAlert({
            show: true, type, title: title || "Notice", message,
            buttons: buttons || [{ label: "Close", variant: type, closeOnClick: true }],
        });
    };

    // --- 1. Load Data on Open ---
    useEffect(() => {
        if (show && program) {
            // Reset fields with passed data
            setProgramCode(program.programCode);
            setProgramName(program.programName);
            
            // We need to fetch colleges to populate the dropdown
            // and determine the correct collegeCode if only collegeName was passed
            fetchColleges(program.collegeName);
            
            // Reset alert
            setAlert(prev => ({ ...prev, show: false }));
        }
    }, [show, program]);

    const fetchColleges = async (currentCollegeName?: string) => {
        try {
            const res = await fetch("/api/colleges");
            const data = await res.json();
            
            if (Array.isArray(data.rows)) {
                const options = data.rows.map((c: any) => ({
                    label: `${c.college_code} - ${c.college_name}`,
                    value: c.college_code,
                    name: c.college_name,
                }));
                setCollegeOptions(options);

                // Auto-select the current college if we have the name or code
                // Ideally, the parent passes collegeCode. If not, we find it by name.
                if (currentCollegeName) {
                    const match = options.find((opt: any) => opt.name === currentCollegeName);
                    if (match) setCollegeCode(match.value);
                }
            }
        } catch (error) {
            console.error("Failed to load colleges", error);
        }
    };

    // --- 2. Action Handlers ---

    const handleUpdate = async () => {
        if (!programName || !collegeCode) {
            showAlert("warning", "Please fill out all fields.");
            return;
        }

        try {
            const res = await fetch("/api/programs/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    program_code: programCode,      // Identify by original code
                    new_program_name: programName,
                    new_college_code: collegeCode,
                }),
            });
            const data = await res.json();

            if (data.success) {
                showAlert("success", "Program updated successfully.");
                setTimeout(() => {
                    onSuccess();
                    handleClose();
                }, 1000);
            } else {
                showAlert("danger", data.message || "Update failed.");
            }
        } catch {
            showAlert("danger", "Server error occurred.");
        }
    };

    const handleDeleteClick = () => {
        showAlert(
            "warning",
            `Are you sure you want to delete ${programCode} - ${programName}?`,
            [
                { label: "Cancel", variant: "secondary", closeOnClick: true },
                { label: "Confirm Delete", variant: "danger", onClick: executeDelete, closeOnClick: true },
            ],
            "Confirm Deletion"
        );
    };

    const executeDelete = async () => {
        try {
            const res = await fetch("/api/programs/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ program_code: programCode }),
            });
            const data = await res.json();

            if (data.success) {
                onSuccess(); // Refresh table
                handleClose(); // Close modal
            } else {
                showAlert("danger", data.message || "Delete failed.");
            }
        } catch {
            showAlert("danger", "Server error occurred.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Update Program</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {/* Alert Section */}
                <AlertBanner
                    message={alert.message}
                    type={alert.type}
                    title={alert.title}
                    show={alert.show}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                    buttons={alert.buttons}
                />

                <FormHolder>
                    {/* Read-Only Program Code */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Program Code (ID)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={programCode} 
                            disabled 
                            style={{ backgroundColor: "#e9ecef" }}
                        />
                        <small className="text-muted">Program Code cannot be changed.</small>
                    </div>

                    {/* Program Name Input */}
                    <InputForm
                        labels={["Program Name"]}
                        value={programName}
                        onChange={(_, val) => setProgramName(val)}
                        pattern={/^(?!\s*$).+/}
                        patternMessage="Program Name cannot be empty"
                    />

                    {/* College Selection */}
                    <SelectForm
                        label="Linked College"
                        options={collegeOptions}
                        value={collegeCode}
                        onChange={setCollegeCode}
                    />
                </FormHolder>
            </Modal.Body>

            <Modal.Footer>
                {/* Left-aligned Delete Button */}
                <div className="me-auto">
                    <Button variant="danger" onClick={handleDeleteClick}>
                        Delete Program
                    </Button>
                </div>

                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleUpdate}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}