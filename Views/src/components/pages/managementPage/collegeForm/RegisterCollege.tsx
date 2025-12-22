import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import InputForm from "../../../forms/InputForm";
import AlertBanner from "../../../alertBanner/AlertBanner";

interface AddCollegeModalProps {
    show: boolean;
    handleClose: () => void;
    onSuccess: () => void;
}

export default function AddCollegeModal({ show, handleClose, onSuccess }: AddCollegeModalProps) {
    const [collegeName, setCollegeName] = useState("");
    const [collegeCode, setCollegeCode] = useState("");
    const [isBusy, setIsBusy] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        type: "info" as "info" | "success" | "danger" | "warning",
        message: "",
    });

    // Reset form when modal opens
    const handleShow = () => {
        setCollegeName("");
        setCollegeCode("");
        setAlert({ show: false, type: "info", message: "" });
    };

    const handleRegister = async () => {
        if (!collegeName.trim() || !collegeCode.trim()) {
            setAlert({
                show: true,
                type: "warning",
                message: "Please fill in both College Name and College Code.",
            });
            return;
        }

        setIsBusy(true);

        try {
            const response = await fetch("/api/colleges/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    college_code: collegeCode.trim(),
                    college_name: collegeName.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setAlert({
                    show: true,
                    type: "success",
                    message: "College registered successfully!",
                });
                
                setTimeout(() => {
                    onSuccess(); // Refresh table
                    handleClose(); // Close modal
                }, 1000);
            } else {
                setAlert({
                    show: true,
                    type: "danger",
                    message: data.message || "Failed to register college.",
                });
            }
        } catch (err) {
            setAlert({
                show: true,
                type: "danger",
                message: "Server error. Please try again later.",
            });
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={isBusy ? undefined : handleClose}
            onShow={handleShow}
            size="lg"
            centered 
            backdrop="static"
            keyboard={!isBusy}
        >
            <div style={{ position: "relative", zIndex: 1060 }}>
                <AlertBanner
                    message={alert.message}
                    type={alert.type}
                    show={alert.show}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                />
            </div>

            <Modal.Header closeButton={!isBusy}>
                <Modal.Title>Add New College</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <InputForm
                        labels={["College Name"]}
                        value={collegeName}
                        onChange={(_, val) => setCollegeName(val)}
                        placeholder="e.g. College of Computer Studies"
                        pattern={/^(?!\s*$).+/}
                        patternMessage="College Name cannot be empty"
                        className="w-100"
                    />
                    <InputForm
                        labels={["College Code"]}
                        value={collegeCode}
                        onChange={(_, val) => setCollegeCode(val)}
                        placeholder="e.g. CCS"
                        pattern={/^(?!\s*$).+/}
                        patternMessage="College Code cannot be empty"
                        className="w-100"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isBusy}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleRegister} disabled={isBusy}>
                    {isBusy ? <><Spinner size="sm" animation="border" className="me-2"/>Saving...</> : "Add College"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}