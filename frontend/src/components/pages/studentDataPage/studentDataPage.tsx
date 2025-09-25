import InformationTable from "../../studentDataTable/StudentTable";
import SearchBar from "../../searchBar/SearchBar";
import "./studentDataPage.css";
import TableDropdown from "../../studentDataTable/TableDropdown";

export default function StudentDataPage() {
    const menuItems = [
        { label: "Action 1", onClick: () => console.log("Action 1 clicked") },
        { label: "Action 2", onClick: () => console.log("Action 2 clicked") },
        { label: "Action 3", onClick: () => console.log("Action 3 clicked") },
    ];

    return (
        <div className="student-data-page">
            <SearchBar />
            <TableDropdown buttonText="Options" items={menuItems} />
            <InformationTable />
        </div>
    );
}
