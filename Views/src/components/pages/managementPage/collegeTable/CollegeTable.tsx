import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "react-bootstrap"; 
import InformationTable from "../../../dataTable/Table";
import SearchBar from "../../../searchBar/SearchBar";
import TableDropdown from "../../../dataTable/TableDropdown";
import TablePagination from "../../../dataTable/TablePagination";
import { sortByOptions, getCollegeColumns } from "../../../../data/Content";
import UpdateCollegeModal from "../collegeForm/UpdateCollege"; 
import AddCollegeModal from "../collegeForm/RegisterCollege"; 

// Make sure to import the CSS that contains the .skeleton-loading class
// If it is global, you might not need this, but usually it is in the parent CSS
import "../../studentDataPage/StudentDataPage.css"; 

export default function CollegeTable() {
    const [colleges, setColleges] = useState<any[]>([]);
    
    // --- Modal States ---
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false); 
    const [selectedCollege, setSelectedCollege] = useState<{ collegeCode: string, collegeName: string } | null>(null);

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
                order_by: "college_name",
                direction: direction,
                limit: String(pagination.pageSize),
                offset: String(pagination.pageIndex * pagination.pageSize),
            });
            if (searchQuery) params.append("q", searchQuery);

            const res = await fetch(`/api/colleges/search?${params.toString()}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            const mapped = data.rows.map((c: any) => ({
                collegeCode: c.college_code,
                collegeName: c.college_name,
            }));

            setColleges(mapped);
            setTotalCount(data.totalCount);
            setPageCount(Math.ceil(data.totalCount / pagination.pageSize));
        } catch (err) {
            console.error("Error fetching colleges:", err);
            setColleges([]); 
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

    const handleUpdate = (code: string) => {
        const college = colleges.find(c => c.collegeCode === code);
        if (college) {
            setSelectedCollege(college);
            setShowUpdateModal(true);
        }
    };

    const columns = useMemo(() => 
        getCollegeColumns(handleUpdate), 
    [colleges]);

    // --- Loading Logic ---
    // 1. Create empty placeholders to fill the table rows while loading
    const placeholders = useMemo(() => {
        return Array.from({ length: pagination.pageSize }).map((_, i) => ({
            collegeCode: `loading-${i}`, 
            collegeName: "",
        }));
    }, [pagination.pageSize]);

    // 2. Switch between real data and placeholders
    const tableData = loading ? placeholders : colleges;

    return (
        <div className="college-data-page">
            {/* --- Modals --- */}
            <UpdateCollegeModal 
                show={showUpdateModal}
                handleClose={() => setShowUpdateModal(false)}
                college={selectedCollege}
                onSuccess={fetchPage} 
            />
            
            <AddCollegeModal
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                onSuccess={fetchPage}
            />

            {/* --- Controls Section --- */}
            <div className="d-flex flex-column flex-md-row gap-3 mb-3 justify-content-between align-items-center">
                <div className="flex-grow-1">
                     <SearchBar onSearch={handleSearch} placeholder="Search by College Code or College Name..." />
                </div>
               
                <div className="d-flex gap-2 shrink-0">
                    <TableDropdown
                        buttonText="Sort:"
                        items={sortByOptions.map(opt => ({ label: opt.label }))}
                        value={sortByOptions.find(opt => opt.value === direction)?.label}
                        onSelect={label => {
                            const selected = sortByOptions.find(opt => opt.label === label);
                            if (selected) setDirection(selected.value);
                        }}
                    />
                    
                    <Button variant="success" onClick={() => setShowAddModal(true)} className="text-nowrap">
                        + Add College
                    </Button>
                </div>
            </div>

            {/* --- Table with Loading State --- */}
            {/* 3. Wrap in loading class */}
            <div className={loading ? "skeleton-loading" : ""}>
                <InformationTable
                    data={tableData}
                    columns={columns}
                    pageIndex={pagination.pageIndex}
                    pageSize={pagination.pageSize}
                    // 4. Force count to 0 while loading so pagination doesn't look weird
                    totalCount={loading ? 0 : totalCount} 
                    onPageChange={page => setPagination(prev => ({ ...prev, pageIndex: page }))}
                    onPageSizeChange={size => setPagination(prev => ({ ...prev, pageSize: size }))}
                    onPageCountChange={setPageCount}
                />
            </div>

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