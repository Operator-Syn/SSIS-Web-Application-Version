import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FormHolder from "../../forms/FormHolder";
import InputForm from "../../forms/InputForm";
import SelectForm from "../../forms/SelectForm";
import HeaderToolbar from "../../forms/HeaderToolbar";
import AlertBanner from "../../alertBanner/AlertBanner";
import "./EnrollmentFormPage.css";

export default function EnrollmentForm() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [yearLevel, setYearLevel] = useState("");
    const [college, setCollege] = useState("");
    const [program, setProgram] = useState("");
    const [idNumber, setIdNumber] = useState("");

    // modal state
    const [showBanner, setShowBanner] = useState(false);

    // show alert banner when component mounts (/forms visited)
    useEffect(() => {
        setShowBanner(true);
    }, []);

    // Options arrays
    const collegeOptions = [
        { label: "College of Computer Studies", value: "CCS" },
    ];

    const programOptions = [
        { label: "Bachelors of Science in Computer Science", value: "BSCS" },
    ];

    const genderOptions = [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" },
    ];

    const yearLevelOptions = [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
    ];

    function getOptionLabel(value: string, options: { label: string; value: string }[]) {
        const option = options.find(o => o.value === value);
        return option ? `${value}: ${option.label}` : "";
    }

    return (
        <div className="enrollment-form-page">
            <HeaderToolbar
                leftText="Enrollment Form"
                rightButtons={[
                    { label: "Update Form", onClick: () => navigate("/forms/update") },
                    { label: "Enroll Student", onClick: () => console.log("Enroll clicked"), className: "btn-progress" },
                ]}
            />

            {/* AlertBanner Modal */}
            <AlertBanner
                message="You are now in the Enrollment Form."
                type="info"
                show={showBanner}
                onClose={() => setShowBanner(false)}
            />

            {/* rest of your form */}
            <FormHolder>
                <InputForm
                    labels={["First Name"]}
                    value={firstName}
                    onChange={(_, val) => setFirstName(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="First Name cannot be empty"
                />
                <InputForm
                    labels={["Middle Name"]}
                    value={middleName}
                    onChange={(_, val) => setMiddleName(val)}
                />
                <InputForm
                    labels={["Last Name"]}
                    value={lastName}
                    onChange={(_, val) => setLastName(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="Last Name cannot be empty"
                />
                <SelectForm
                    label="Gender"
                    options={genderOptions}
                    value={gender}
                    onChange={setGender}
                />
                <SelectForm
                    label="Year Level"
                    options={yearLevelOptions}
                    value={yearLevel}
                    onChange={setYearLevel}
                />
            </FormHolder>

            <hr className="thick-divider" />

            <FormHolder>
                <SelectForm
                    label="College"
                    options={collegeOptions}
                    value={college}
                    onChange={setCollege}
                />
                <SelectForm
                    label="Program"
                    options={programOptions}
                    value={program}
                    onChange={setProgram}
                />
            </FormHolder>

            <hr className="thick-divider d-block d-md-none" />

            <FormHolder>
                <InputForm
                    labels={["ID Number"]}
                    value={idNumber}
                    onChange={(_, val) => setIdNumber(val)}
                    pattern={/^\d{4}-\d{4}$/}
                    patternMessage="ID must be in the format 1234-5678"
                />
            </FormHolder>

            <hr className="thick-divider" />

            <FormHolder>
                <InputForm
                    labels={["Your selected College"]}
                    className="text-center"
                    disabled
                    readOnly
                    value={getOptionLabel(college, collegeOptions)}
                />
                <InputForm
                    labels={["Your selected Program"]}
                    className="text-center"
                    disabled
                    readOnly
                    value={getOptionLabel(program, programOptions)}
                />
            </FormHolder>
        </div>
    );
}
