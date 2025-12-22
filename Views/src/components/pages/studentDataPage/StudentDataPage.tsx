import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import InformationTable from "../../dataTable/Table";
import SearchBar from "../../searchBar/SearchBar";
import TableDropdown from "../../dataTable/TableDropdown";
import TablePagination from "../../dataTable/TablePagination";
import UpdateForm from "../enrollmentFormsPage/UpdateFormPage"; 
import EnrollmentForm from "../enrollmentFormsPage/EnrollmentFormPage"; // Import existing name
import AlertBanner from "../../alertBanner/AlertBanner"; 
import "./StudentDataPage.css";
import { sortByOptions, getStudentColumns, type Student } from "../../../data/Content";
import { sortingStudentOptions as sortingOptions } from "../../../data/SortingOptions";

export default function StudentDataPage() {
    
    // --- Data State ---
    const [students, setStudents] = useState<Student[]>([]);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
    const [pageCount, setPageCount] = useState(0);
    const [sortBy, setSortBy] = useState("id_number");
    const [direction, setDirection] = useState("ASC");
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // --- Modal State ---
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false); // State for Enrollment Modal
    const [selectedStudentId, setSelectedStudentId] = useState("");

    // --- Alert State ---
    const [alert, setAlert] = useState({
        show: false,
        type: "info" as "info" | "success" | "danger" | "warning",
        title: "Notice",
        message: "",
        buttons: [] as any[],
    });

    const showAlert = useCallback((type: any, message: string, buttons?: any[], title?: string) => {
        setAlert({
            show: true, type, title: title || "Notice", message,
            buttons: buttons || [{ label: "Close", variant: type, closeOnClick: true }],
        });
    }, []);

    // --- Data Fetching Logic ---
    const fetchPage = useCallback(async (pageIndex: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                order_by: sortBy, direction: direction,
                limit: String(pagination.pageSize), offset: String(pageIndex * pagination.pageSize),
            });
            if (searchQuery) params.append("q", searchQuery);

            const res = await fetch(`/api/students/search?${params.toString()}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            const mapped: Student[] = data.rows.map((s: any) => ({
                id: s.id_number, firstName: s.first_name, middleName: s.middle_name ?? undefined,
                lastName: s.last_name, gender: s.gender, yearLevel: s.year_level,
                program: s.program_name, collegeName: s.college_name, imagePath: s.profile_image_path ?? null,
            }));

            setStudents(mapped);
            setTotalCount(data.totalCount);
            setPageCount(Math.ceil(data.totalCount / pagination.pageSize));
        } catch (err) {
            console.error(err);
            showAlert("danger", "Failed to fetch student data.");
        } finally { setLoading(false); }
    }, [pagination.pageSize, sortBy, direction, searchQuery, showAlert]);

    // --- Action Handlers ---
    const handleUpdate = useCallback((id: string) => {
        setSelectedStudentId(id);
        setShowUpdateModal(true);
    }, []);

    const handleUpdateSuccess = useCallback(() => {
        setShowUpdateModal(false);
        fetchPage(pagination.pageIndex);
    }, [fetchPage, pagination.pageIndex]);

    const handleEnrollSuccess = useCallback(() => {
        setShowEnrollModal(false);
        // Reset to first page to see the new student
        setPagination(prev => ({ ...prev, pageIndex: 0 })); 
        fetchPage(0); 
    }, [fetchPage]);

    const executeDelete = useCallback(async (id: string) => {
        try {
            const res = await fetch("/api/students/delete", {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_number: id }),
            });
            const result = await res.json();
            if (res.ok && result.success) {
                showAlert("success", `Student ${id} has been deleted.`);
                fetchPage(pagination.pageIndex);
            } else {
                showAlert("danger", `Failed to delete: ${result.message}`);
            }
        } catch (error) {
            showAlert("danger", "An error occurred while deleting the student.");
        }
    }, [showAlert, fetchPage, pagination.pageIndex]);

    const handleDeleteClick = useCallback((id: string) => {
        showAlert("warning", `Are you sure you want to permanently delete student ${id}?`, 
            [{ label: "Cancel", variant: "secondary", closeOnClick: true },
             { label: "Delete", variant: "danger", onClick: () => executeDelete(id), closeOnClick: true }], "Confirm Deletion");
    }, [showAlert, executeDelete]);

    const columns = useMemo(() => getStudentColumns(handleUpdate), [handleUpdate, handleDeleteClick]);

    const placeholders = useMemo(() => {
        return Array.from({ length: pagination.pageSize }).map((_, i) => ({
            id: `loading-${i}`, firstName: "", lastName: "", middleName: "",
            gender: "", yearLevel: 0, collegeName: "", program: "", imagePath: null 
        })) as Student[];
    }, [pagination.pageSize]);

    const tableData = loading ? placeholders : students;

    useEffect(() => { fetchPage(pagination.pageIndex); }, [pagination.pageIndex, fetchPage]);
    useEffect(() => { setPagination(prev => ({ ...prev, pageIndex: 0 })); }, [searchQuery, sortBy, direction, pagination.pageSize]);

    return (
        <div className="student-data-page">
            <AlertBanner
                message={alert.message} type={alert.type} title={alert.title} show={alert.show}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))} buttons={alert.buttons}
            />

            <div className="d-flex flex-column flex-xl-row gap-3 mb-3 align-items-stretch">
                <SearchBar onSearch={setSearchQuery} placeholder="Search by ID, Name..." />
                
                <div className="d-flex gap-2 ms-xl-auto">
                    <TableDropdown
                        buttonText="Sort Direction:"
                        items={sortByOptions.map((opt) => ({ label: opt.label }))}
                        value={sortByOptions.find((opt) => opt.value === direction)?.label}
                        onSelect={(label) => setDirection(sortByOptions.find((opt) => opt.label === label)?.value || "ASC")}
                    />
                    <TableDropdown
                        buttonText="Sort By:"
                        items={sortingOptions.map((opt) => ({ label: opt.label }))}
                        value={sortingOptions.find((opt) => opt.value === sortBy)?.label}
                        onSelect={(label) => setSortBy(sortingOptions.find((opt) => opt.label === label)?.value || "id_number")}
                    />
                    
                    {/* Enroll Button */}
                    <Button 
                        variant="success" 
                        className="d-flex align-items-center text-nowrap"
                        onClick={() => setShowEnrollModal(true)}
                    >
                        <i className="bi bi-person-plus-fill me-2"></i> Enroll Student
                    </Button>
                </div>
            </div>

            <div className={loading ? "skeleton-loading" : ""}>
                <InformationTable
                    data={tableData} columns={columns}
                    pageIndex={pagination.pageIndex} pageSize={pagination.pageSize} totalCount={loading ? 0 : totalCount}
                    onPageChange={(page) => setPagination(prev => ({ ...prev, pageIndex: page }))}
                    onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size }))}
                    onPageCountChange={setPageCount}
                />
            </div>

            <div className="d-flex p-2">
                <TablePagination
                    pageIndex={pagination.pageIndex} pageCount={pageCount} pageSize={pagination.pageSize}
                    onPageChange={(page) => setPagination(prev => ({ ...prev, pageIndex: page }))}
                    onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size }))}
                />
            </div>

            <UpdateForm 
                show={showUpdateModal} 
                handleClose={() => setShowUpdateModal(false)} 
                initialId={selectedStudentId}
                onSuccess={handleUpdateSuccess} 
            />
            
            <EnrollmentForm 
                show={showEnrollModal}
                handleClose={() => setShowEnrollModal(false)}
                onSuccess={handleEnrollSuccess}
            />
        </div>
    );
}