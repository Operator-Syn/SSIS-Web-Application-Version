import { useState } from "react";
import Tabs from "../../tabs/Tabs";
import CollegeTable from "./collegeTable/CollegeTable";
import ProgramTable from "./programTable/ProgramTable";
import RegisterProgram from "./programForm/RegisterProgram";
import UpdateProgram from "./programForm/UpdateProgram"

export default function ManagementPage() {
    const [activeCollegeTab, setActiveCollegeTab] = useState("collegeTable");

    const nestedCollegeTab = [
        { id: "collegeTable", label: "College Table", content: <CollegeTable /> },
    ];

    const nestedProgramTab = [
        { id: "programTable", label: "Programs Table", content: <ProgramTable /> },
        { id: "managePrograms", label: "Register Program", content: <RegisterProgram/> },
        { id: "updateProgram", label: "Update Program", content: <UpdateProgram /> },
    ];

    const tabData = [
        {
            id: "college",
            label: "College",
            content: (
                <Tabs
                    className="ps-lg-10"
                    tabs={nestedCollegeTab}
                    defaultActiveId={activeCollegeTab}
                    onTabChange={setActiveCollegeTab}
                />
            ),
        },
        {
            id: "program",
            label: "Program",
            content: (
                <Tabs className="ps-lg-10" tabs={nestedProgramTab} />
            ),
        },
    ];

    return <Tabs tabs={tabData} />;
}
