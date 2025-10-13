import { useState, useEffect } from "react";
import FormHolder from "../../../forms/FormHolder";
import InputForm from "../../../forms/InputForm";
import HeaderToolbar from "../../../forms/HeaderToolbar";
import AlertBanner from "../../../alertBanner/AlertBanner";

export default function EnrollmentForm() {

    const [collegeName, setCollegeName] = useState("");
    const [collegeCode, setCollegeCode] = useState("");``


    // modal state
    const [showBanner, setShowBanner] = useState(false);

    // show alert banner when component mounts (/forms visited)
    useEffect(() => {
        setShowBanner(true);
    }, []);

    return (
        <div className="registerCollege-form-page">
            <HeaderToolbar
                leftText="College Registration Form"
                rightButtons={[
                    { label: "Register College", onClick: () => console.log("Register clicked") },
                ]}
            />

            {/* AlertBanner Modal */}
            <AlertBanner
                message="You are now in the College Registration Form."
                type="info"
                show={showBanner}
                onClose={() => setShowBanner(false)}
            />

            {/* rest of your form */}
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
