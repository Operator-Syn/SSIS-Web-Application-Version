import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "react-bootstrap"; // Added Button import
import InformationTable from "../../../dataTable/Table";
import SearchBar from "../../../searchBar/SearchBar";
import TableDropdown from "../../../dataTable/TableDropdown";
import TablePagination from "../../../dataTable/TablePagination";
import { sortByOptions, getProgramColumns } from "../../../../data/Content";
import UpdateProgramModal from "../programForm/UpdateProgram";
import AddProgramModal from "../programForm/RegisterProgram";

export default function ProgramTable() {
    const [programs, setPrograms] = useState<any[]>([]);

    // --- Modal States ---
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false); // 1. New State for Add Modal

    const [selectedProgram, setSelectedProgram] = useState<{
        programCode: string,
        programName: string,
        collegeName: string
    } | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [pageCount, setPageCount] = useState(0);
    const [direction, setDirection] = useState("ASC");
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchPage = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                order_by: "program_name",
                direction: direction,
                limit: String(pagination.pageSize),
                offset: String(pagination.pageIndex * pagination.pageSize),
            });
            if (searchQuery) params.append("q", searchQuery);

            const res = await fetch(`/api/programs/search?${params.toString()}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            const mapped = data.rows.map((p: any) => ({
                programCode: p.program_code,
                programName: p.program_name,
                collegeName: p.college_name,
            }));

            setPrograms(mapped);
            setTotalCount(data.totalCount);
            setPageCount(Math.ceil(data.totalCount / pagination.pageSize));
        } catch (err) {
            console.error("Error fetching programs:", err);
            setPrograms([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageIndex, pagination.pageSize, direction, searchQuery]);

    useEffect(() => {
        fetchPage();
    }, [fetchPage]);

    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [searchQuery, direction, pagination.pageSize]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    // --- Connection Logic ---
    const handleUpdate = useCallback((code: string) => {
        const program = programs.find(p => p.programCode === code);
        if (program) {
            setSelectedProgram(program);
            setShowUpdateModal(true);
        }
    }, [programs]);

    const columns = useMemo(() =>
        getProgramColumns(handleUpdate),
        [handleUpdate]);

    return (
        <div className="program-data-page">
            {/* --- Modals --- */}
            <UpdateProgramModal
                show={showUpdateModal}
                handleClose={() => setShowUpdateModal(false)}
                program={selectedProgram}
                onSuccess={fetchPage}
            />

            {/* 2. Render Add Modal */}
            <AddProgramModal
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                onSuccess={fetchPage}
            />

            {/* Filters Row */}
            <div className="d-flex flex-column flex-md-row gap-3 mb-3 justify-content-between align-items-center">
                <div className="flex-grow-1">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search by Program Code, Program Name, or College..."
                    />
                </div>

                <div className="d-flex gap-2 shrink-0">

                    <TableDropdown
                        buttonText="Sort Direction:"
                        items={sortByOptions.map(opt => ({ label: opt.label }))}
                        value={sortByOptions.find(opt => opt.value === direction)?.label}
                        onSelect={label => {
                            const selected = sortByOptions.find(opt => opt.label === label);
                            if (selected) setDirection(selected.value);
                        }}
                    />

                    {/* 3. Add Button */}
                    <Button
                        variant="success"
                        onClick={() => setShowAddModal(true)}
                        className="d-flex align-items-center"
                    >
                        Register Program
                    </Button>

                </div>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading programs...</p>
            ) : (
                <InformationTable
                    data={programs}
                    columns={columns}
                    pageIndex={pagination.pageIndex}
                    pageSize={pagination.pageSize}
                    totalCount={totalCount}
                    onPageChange={page => setPagination(prev => ({ ...prev, pageIndex: page }))}
                    onPageSizeChange={size => setPagination(prev => ({ ...prev, pageSize: size }))}
                    onPageCountChange={setPageCount}
                />
            )}

            {/* Pagination */}
            <div className="d-flex p-2">
                <TablePagination
                    pageIndex={pagination.pageIndex}
                    pageCount={pageCount}
                    pageSize={pagination.pageSize}
                    onPageChange={page => setPagination(prev => ({ ...prev, pageIndex: page }))}
                    onPageSizeChange={size => setPagination(prev => ({ ...prev, pageSize: size }))}
                />
            </div>
        </div>
    );
}