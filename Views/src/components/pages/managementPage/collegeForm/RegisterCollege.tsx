import { useState, useEffect } from "react";
import FormHolder from "../../../forms/FormHolder";
import InputForm from "../../../forms/InputForm";
import HeaderToolbar from "../../../forms/HeaderToolbar";
import AlertBanner, { type AlertBannerProps } from "../../../alertBanner/AlertBanner";

export default function EnrollmentForm() {
    const [collegeName, setCollegeName] = useState("");
    const [collegeCode, setCollegeCode] = useState("");

    // Info banner when page loads
    const [showBanner, setShowBanner] = useState(false);

    // Alert state for success/error messages
    const [alert, setAlert] = useState<{
        show: boolean;
        type: AlertBannerProps["type"];
        message: string;
    }>({
        show: false,
        type: "info",
        message: "",
    });

    useEffect(() => {
        setShowBanner(true);
    }, []);

    // Handle college registration
    const handleRegister = async () => {
        if (!collegeName.trim() || !collegeCode.trim()) {
            setAlert({
                show: true,
                type: "danger", // use Bootstrap-compatible variant
                message: "Please fill in both College Name and College Code.",
            });
            return;
        }

        try {
            const response = await fetch("/api/colleges/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
                    message: data.message || "College registered successfully!",
                });

                // Reset form fields
                setCollegeCode("");
                setCollegeName("");
            } else {
                setAlert({
                    show: true,
                    type: "danger",
                    message: data.message || "Failed to register college.",
                });
            }
        } catch (err) {
            console.error("Error registering college:", err);
            setAlert({
                show: true,
                type: "danger",
                message: "Server error. Please try again later.",
            });
        }
    };

    return (
        <div className="registerCollege-form-page">
            <HeaderToolbar
                leftText="College Registration Form"
                rightButtons={[
                    { label: "Register College", onClick: handleRegister, className: "btn-progress" },
                ]}
            />

            {/* Info banner when page loads */}
            <AlertBanner
                message="You are now in the College Registration Form."
                type="info"
                show={showBanner}
                onClose={() => setShowBanner(false)}
            />

            {/* Feedback banner for success or error */}
            <AlertBanner
                message={alert.message}
                type={alert.type}
                show={alert.show}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            />

            <FormHolder>
                <InputForm
                    labels={["College Name"]}
                    value={collegeName}
                    onChange={(_, val) => setCollegeName(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="College Name cannot be empty"
                />
                <InputForm
                    labels={["College Code"]}
                    value={collegeCode}
                    onChange={(_, val) => setCollegeCode(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="College Code cannot be empty"
                />
            </FormHolder>
        </div>
    );
}
