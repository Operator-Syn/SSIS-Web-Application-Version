import { useState } from "react";
import InformationTable from "../../../dataTable/Table";
import SearchBar from "../../../searchBar/SearchBar";
import TableDropdown from "../../../dataTable/TableDropdown";
import TablePagination from "../../../dataTable/TablePagination";
// import "./StudentDataPage.css";
import { sortByOptions, students, studentColumns } from "../../../../data/Content";
import { sortingStudentOptions as sortingOptions} from "../../../../data/SortingOptions"

export default function ProgramTable() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [pageCount, setPageCount] = useState(0); // keep it here

    return (
        <div className="student-data-page">
            {/* Filters row */}
            <div className="d-flex flex-column flex-md-row gap-3 mb-3">
                <SearchBar />
                <TableDropdown buttonText="Sort By:" items={sortByOptions} />
                <TableDropdown buttonText="Sorting Options:" items={sortingOptions} />
            </div>

            {/* Table */}
            <InformationTable
                data={students}                 // <-- add data
                columns={studentColumns}        // <-- add columns
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page }))}
                onPageSizeChange={(size) => setPagination((prev) => ({ ...prev, pageSize: size }))}
                onPageCountChange={setPageCount}   // capture pageCount
            />

            {/* Pagination controls */}
            <div className="d-flex p-2">
                <TablePagination
                    pageIndex={pagination.pageIndex}
                    pageCount={pageCount}   // automatically updated
                    pageSize={pagination.pageSize}
                    onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page }))}
                    onPageSizeChange={(size) => setPagination((prev) => ({ ...prev, pageSize: size }))}
                />
            </div>
        </div>
    );
}
