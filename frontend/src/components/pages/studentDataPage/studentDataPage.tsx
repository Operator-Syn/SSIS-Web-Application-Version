import InformationTable from "../../studentDataInformation/StudentTable";
import SearchBar from "../../searchBar/SearchBar";
import "./studentDataPage.css";

export default function StudentDataPage() {
    return (
        <div className="student-data-page">
            <SearchBar />
            <InformationTable />
        </div>
    );
}
