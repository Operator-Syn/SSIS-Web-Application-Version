import { useState, useEffect } from "react";
import FormHolder from "../../../forms/FormHolder";
import InputForm from "../../../forms/InputForm";
import SelectForm from "../../../forms/SelectForm";
import HeaderToolbar from "../../../forms/HeaderToolbar";
import AlertBanner from "../../../alertBanner/AlertBanner";

export default function UpdateCollegeForm() {
    const [collegeName, setCollegeName] = useState("");
    const [collegeCode, setCollegeCode] = useState("");
    const [collegeOptions, setCollegeOptions] = useState<
        { label: string; value: string; name: string }[]
    >([]);

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

    /** Load colleges for dropdown */
    const loadColleges = async () => {
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
            } else {
                showAlert("danger", "Failed to load colleges.");
            }
        } catch {
            showAlert("danger", "Error fetching college list.");
        }
    };

    useEffect(() => {
        loadColleges();
    }, []);

    /** Reusable alert helper */
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
            buttons: buttons || [
                { label: "Close", variant: type, closeOnClick: true },
            ],
        });
    };

    /** Autofill college name when a code is selected */
    const handleSelectCollege = (code: string) => {
        setCollegeCode(code);
        const selected = collegeOptions.find((opt) => opt.value === code);
        setCollegeName(selected ? selected.name : "");
    };

    /** Update college name */
    const handleUpdateCollege = async () => {
        if (!collegeCode || !collegeName) {
            showAlert(
                "warning",
                "Please select a college and enter a new name."
            );
            return;
        }

        try {
            const res = await fetch("/api/colleges/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    college_code: collegeCode,
                    new_college_name: collegeName,
                }),
            });

            const data = await res.json();
            showAlert(
                data.success ? "success" : "danger",
                data.message
            );

            if (data.success) {
                await loadColleges();
                setCollegeCode("");
                setCollegeName("");
            }
        } catch {
            showAlert("danger", "Error connecting to the server.");
        }
    };

    /** Step 1: Ask for confirmation */
    const handleDeleteCollege = () => {
        if (!collegeCode) {
            showAlert("warning", "Please select a college to delete.");
            return;
        }

        const selected = collegeOptions.find((opt) => opt.value === collegeCode);
        const collegeLabel = selected ? selected.label : collegeCode;

        showAlert(
            "warning",
            `Are you sure you want to delete ${collegeLabel}? This action cannot be undone.`,
            [
                { label: "Cancel", variant: "secondary", closeOnClick: true },
                {
                    label: "Delete",
                    variant: "danger",
                    onClick: confirmDeleteCollege,
                    closeOnClick: true,
                },
            ],
            "Confirm Deletion"
        );
    };

    /** Step 2: Perform deletion once confirmed */
    const confirmDeleteCollege = async () => {
        try {
            const res = await fetch("/api/colleges/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ college_code: collegeCode }),
            });

            const data = await res.json();
            showAlert(
                data.success ? "success" : "danger",
                data.message
            );

            if (data.success) {
                await loadColleges();
                setCollegeCode("");
                setCollegeName("");
            }
        } catch {
            showAlert("danger", "Error connecting to the server.");
        }
    };

    return (
        <div className="updateCollege-form-page">
            <HeaderToolbar
                leftText="Update College Form"
                rightButtons={[
                    { label: "Update College", onClick: handleUpdateCollege, className: "btn-progress" },
                    { label: "Delete College", className: "btn-danger", onClick: handleDeleteCollege},
                ]}
            />

            <AlertBanner
                message={alert.message}
                type={alert.type}
                title={alert.title}
                show={alert.show}
                onClose={() =>
                    setAlert((prev) => ({ ...prev, show: false }))
                }
                buttons={alert.buttons}
            />

            <FormHolder>
                <SelectForm
                    label="Select College Code"
                    options={collegeOptions}
                    value={collegeCode}
                    onChange={handleSelectCollege}
                />
                <InputForm
                    labels={["College Name"]}
                    value={collegeName}
                    onChange={(_, val) => setCollegeName(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="College Name cannot be empty"
                />
            </FormHolder>
        </div>
    );
}
