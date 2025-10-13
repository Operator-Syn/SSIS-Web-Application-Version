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


    // modal state
    const [showBanner, setShowBanner] = useState(false);

    // show alert banner when component mounts (/forms visited)
    useEffect(() => {
        setShowBanner(true);
    }, []);

    return (
        <div className="registerCollege-form-page">
            <HeaderToolbar
                leftText="Program Update Form"
                rightButtons={[
                    { label: "Update Program", onClick: () => console.log("Update clicked") },
                ]}
            />

            {/* AlertBanner Modal */}
            <AlertBanner
                message="You are now in the Program Update Form."
                type="info"
                show={showBanner}
                onClose={() => setShowBanner(false)}
            />

            {/* rest of your form */}
            <FormHolder>
                <InputForm
                    labels={["Program Name"]}
                    value={programName}
                    onChange={(_, val) => setProgramName(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="Program Name cannot be empty"
                />

                <SelectForm
                    label="Select Program Code"
                    options={null}
                    value={programCode}
                    onChange={setProgramCode}
                />

                <SelectForm
                    label="Linked College Code"
                    options={null}
                    value={collegeCode}
                    onChange={setCollegeCode}
                />
            </FormHolder>

        </div>
    );
}
