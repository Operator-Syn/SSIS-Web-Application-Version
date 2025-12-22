import { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import InputForm from "../../../forms/InputForm";
import AlertBanner from "../../../alertBanner/AlertBanner";

interface UpdateCollegeModalProps {
    show: boolean;
    handleClose: () => void;
    college: { collegeCode: string; collegeName: string } | null;
    onSuccess: () => void;
}

export default function UpdateCollegeModal({ show, handleClose, college, onSuccess }: UpdateCollegeModalProps) {
    const [collegeName, setCollegeName] = useState("");
    const [isBusy, setIsBusy] = useState(false);

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

    useEffect(() => {
        if (college) {
            setCollegeName(college.collegeName);
            setAlert({ 
                show: false, 
                type: "info", 
                title: "Notice", 
                message: "", 
                buttons: [] 
            });
        }
    }, [college, show]);

    const showAlert = (
        type: "info" | "success" | "danger" | "warning",
        message: string,
        buttons?: { label: string; variant?: string; onClick?: () => void; closeOnClick?: boolean }[],
        title?: string
    ) => {
        setAlert({
            show: true,
            type,
            title: title || "Notice",
            message,
            buttons: buttons || [],
        });
    };

    // --- UPDATE ---
    const handleUpdateCollege = async () => {
        if (!college || !collegeName.trim()) {
            showAlert("warning", "College Name cannot be empty.");
            return;
        }
        setIsBusy(true);
        try {
            const res = await fetch("/api/colleges/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    college_code: college.collegeCode,
                    new_college_name: collegeName,
                }),
            });
            const data = await res.json();
            if (data.success) {
                showAlert("success", "College updated successfully!");
                setTimeout(() => { onSuccess(); handleClose(); }, 1000);
            } else {
                showAlert("danger", data.message || "Update failed.");
            }
        } catch {
            showAlert("danger", "Error connecting to the server.");
        } finally {
            setIsBusy(false);
        }
    };

    // --- DELETE ---
    const handleDeleteClick = () => {
        if (!college) return;
        showAlert(
            "warning",
            `Are you sure you want to delete ${college.collegeCode}? This cannot be undone.`,
            [
                { label: "Cancel", variant: "secondary", closeOnClick: true },
                { label: "Confirm Delete", variant: "danger", onClick: performDelete, closeOnClick: true },
            ],
            "Confirm Deletion"
        );
    };

    const performDelete = async () => {
        if (!college) return;
        setIsBusy(true);
        try {
            const res = await fetch("/api/colleges/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ college_code: college.collegeCode }),
            });
            const data = await res.json();
            if (data.success) {
                showAlert("success", "College deleted successfully.");
                setTimeout(() => { onSuccess(); handleClose(); }, 1000);
            } else {
                showAlert("danger", data.message || "Delete failed.");
            }
        } catch {
            showAlert("danger", "Error connecting to the server.");
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <Modal 
            show={show} 
            onHide={isBusy ? undefined : handleClose} 
            size="lg"
            centered 
            backdrop="static"
            keyboard={!isBusy}
        >
            <div style={{ position: "relative", zIndex: 1060 }}>
                <AlertBanner
                    message={alert.message}
                    type={alert.type}
                    title={alert.title}
                    show={alert.show}
                    onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
                    buttons={alert.buttons}
                />
            </div>

            <Modal.Header closeButton={!isBusy}>
                <Modal.Title>Update College</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <InputForm
                        labels={["College Code"]}
                        value={college?.collegeCode || ""}
                        readOnly={true}
                        className="bg-light w-100" 
                    />
                    <InputForm
                        labels={["College Name"]}
                        value={collegeName}
                        onChange={(_, val) => setCollegeName(val)}
                        pattern={/^(?!\s*$).+/}
                        patternMessage="College Name cannot be empty"
                        className="w-100"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="danger" onClick={handleDeleteClick} disabled={isBusy}>
                    Delete College
                </Button>
                <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={handleClose} disabled={isBusy}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdateCollege} disabled={isBusy}>
                        {isBusy ? <><Spinner size="sm" animation="border" className="me-2"/>Processing...</> : "Save Changes"}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}