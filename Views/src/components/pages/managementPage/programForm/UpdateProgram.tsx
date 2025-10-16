import { useState, useEffect } from "react";
import FormHolder from "../../../forms/FormHolder";
import InputForm from "../../../forms/InputForm";
import SelectForm from "../../../forms/SelectForm";
import HeaderToolbar from "../../../forms/HeaderToolbar";
import AlertBanner from "../../../alertBanner/AlertBanner";

export default function ProgramUpdateForm() {
    const [programName, setProgramName] = useState("");
    const [programCode, setProgramCode] = useState("");
    const [collegeCode, setCollegeCode] = useState("");

    const [programList, setProgramList] = useState<any[]>([]);
    const [programOptions, setProgramOptions] = useState<{ label: string; value: string; name: string }[]>([]);
    const [collegeOptions, setCollegeOptions] = useState<{ label: string; value: string; name: string }[]>([]);

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

    /** Load programs and colleges for dropdowns */
    const loadData = async () => {
        try {
            const [programRes, collegeRes] = await Promise.all([
                fetch("/api/programs"),
                fetch("/api/colleges"),
            ]);
            const [programData, collegeData] = await Promise.all([
                programRes.json(),
                collegeRes.json(),
            ]);

            if (Array.isArray(programData.rows)) {
                setProgramList(programData.rows);
                setProgramOptions(programData.rows.map((p: any) => ({
                    label: `${p.program_code} - ${p.program_name}`,
                    value: p.program_code,
                    name: p.program_name,
                })));
            }

            if (Array.isArray(collegeData.rows)) {
                setCollegeOptions(collegeData.rows.map((c: any) => ({
                    label: `${c.college_code} - ${c.college_name}`,
                    value: c.college_code,
                    name: c.college_name,
                })));
            }
        } catch (error) {
            showAlert("danger", "Failed to load program or college data.");
        }
    };

    useEffect(() => {
        loadData();
        showAlert("info", "You are now in the Program Update Form.");
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
            buttons: buttons || [{ label: "Close", variant: type, closeOnClick: true }],
        });
    };

    /** Autofill program name and linked college when a program is selected */
    const handleSelectProgram = (code: string) => {
        setProgramCode(code);
        const selected = programList.find(p => p.program_code === code);
        setProgramName(selected ? selected.program_name : "");

        const validCollege = collegeOptions.find(c => c.value === selected?.college_code);
        setCollegeCode(validCollege ? validCollege.value : "");
    };

    /** Update program */
    const handleUpdateProgram = async () => {
        if (!programCode || !programName || !collegeCode) {
            showAlert("warning", "Please fill out all fields before updating.");
            return;
        }

        try {
            const res = await fetch("/api/programs/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    program_code: programCode,
                    new_program_name: programName,
                    new_college_code: collegeCode,
                }),
            });
            const data = await res.json();
            showAlert(data.success ? "success" : "danger", data.message);

            if (data.success) {
                setProgramCode("");
                setProgramName("");
                setCollegeCode("");
                await loadData();
            }
        } catch {
            showAlert("danger", "Error connecting to the server.");
        }
    };

    /** Step 1: Ask for confirmation before delete */
    const handleDeleteProgram = () => {
        if (!programCode) {
            showAlert("warning", "Please select a program to delete.");
            return;
        }

        const selected = programOptions.find(opt => opt.value === programCode);
        const programLabel = selected ? selected.label : programCode;

        showAlert(
            "warning",
            `Are you sure you want to delete ${programLabel}? This action cannot be undone.`,
            [
                { label: "Cancel", variant: "secondary", closeOnClick: true },
                { label: "Delete", variant: "danger", onClick: confirmDeleteProgram, closeOnClick: true },
            ],
            "Confirm Deletion"
        );
    };

    /** Step 2: Perform deletion once confirmed */
    const confirmDeleteProgram = async () => {
        try {
            const res = await fetch("/api/programs/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ program_code: programCode }),
            });

            const data = await res.json();
            showAlert(data.success ? "success" : "danger", data.message);

            if (data.success) {
                setProgramCode("");
                setProgramName("");
                setCollegeCode("");
                await loadData();
            }
        } catch {
            showAlert("danger", "Error connecting to the server.");
        }
    };

    return (
        <div className="updateProgram-form-page">
            <HeaderToolbar
                leftText="Program Update Form"
                rightButtons={[
                    { label: "Update Program", onClick: handleUpdateProgram, className: "btn-progress" },
                    { label: "Delete Program", className: "btn-danger", onClick: handleDeleteProgram },
                ]}
            />

            <AlertBanner
                message={alert.message}
                type={alert.type}
                title={alert.title}
                show={alert.show}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                buttons={alert.buttons}
            />

            <FormHolder>
                <SelectForm
                    label="Select Program Code"
                    options={programOptions}
                    value={programCode}
                    onChange={handleSelectProgram}
                />

                <InputForm
                    labels={["Program Name"]}
                    value={programName}
                    onChange={(_, val) => setProgramName(val)}
                    pattern={/^(?!\s*$).+/}
                    patternMessage="Program Name cannot be empty"
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
