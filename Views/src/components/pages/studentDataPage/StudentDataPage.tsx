import { useEffect, useState, useCallback } from "react";
import InformationTable from "../../dataTable/Table";
import SearchBar from "../../searchBar/SearchBar";
import TableDropdown from "../../dataTable/TableDropdown";
import TablePagination from "../../dataTable/TablePagination";
import "./StudentDataPage.css";
import { sortByOptions, studentColumns, type Student } from "../../../data/Content";
import { sortingStudentOptions as sortingOptions } from "../../../data/SortingOptions";

export default function StudentDataPage() {
    const [studentsCache, setStudentsCache] = useState<{ [key: string]: Student[] }>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
    const [pageCount, setPageCount] = useState(0);
    const [sortBy, setSortBy] = useState("id_number");
    const [direction, setDirection] = useState("ASC");
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Helper: generate cache key per page & pageSize
    const getCacheKey = (pageIndex: number, pageSize: number) => `${pageIndex}_${pageSize}`;

    // Fetch a specific page and cache it
    const fetchPage = useCallback(async (pageIndex: number) => {
        const cacheKey = getCacheKey(pageIndex, pagination.pageSize);
        if (studentsCache[cacheKey]) return; // already cached

        try {
            if (pageIndex === pagination.pageIndex) setLoading(true);

            const params = new URLSearchParams({
                order_by: sortBy,
                direction: direction,
                limit: String(pagination.pageSize),
                offset: String(pageIndex * pagination.pageSize),
            });
            if (searchQuery) params.append("q", searchQuery);

            const res = await fetch(`/api/students/search?${params.toString()}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            const mapped: Student[] = data.rows.map((s: any) => ({
                id: s.id_number,
                firstName: s.first_name,
                middleName: s.middle_name ?? undefined,
                lastName: s.last_name,
                gender: s.gender,
                yearLevel: s.year_level,
                program: s.program_name,
                collegeName: s.college_name,
            }));

            setStudentsCache(prev => ({ ...prev, [cacheKey]: mapped }));
            setTotalCount(data.totalCount);
            setPageCount(Math.ceil(data.totalCount / pagination.pageSize));
        } catch (err) {
            console.error("Error fetching students:", err);
        } finally {
            if (pageIndex === pagination.pageIndex) setLoading(false);
        }
    }, [pagination.pageIndex, pagination.pageSize, sortBy, direction, searchQuery, studentsCache]);

    // Fetch current page and prefetch next page
    useEffect(() => {
        fetchPage(pagination.pageIndex);         // current page
        fetchPage(pagination.pageIndex + 1);     // prefetch next
    }, [pagination.pageIndex, pagination.pageSize, fetchPage]);

    // Clear cache when search, sort, or pageSize changes
    useEffect(() => {
        setStudentsCache({});
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [searchQuery, sortBy, direction, pagination.pageSize]);

    // Debounced search handler
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    // Current page data
    const currentCacheKey = getCacheKey(pagination.pageIndex, pagination.pageSize);
    const currentPageData = studentsCache[currentCacheKey] ?? [];

    return (
        <div className="student-data-page">
            <div className="d-flex flex-column flex-md-row gap-3 mb-3">
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search by ID, Name, Program, or College..."
                />

                {/* Sorting Direction */}
                <TableDropdown
                    buttonText="Sort Direction:"
                    items={sortByOptions.map((opt) => ({ label: opt.label }))}
                    value={sortByOptions.find((opt) => opt.value === direction)?.label}
                    onSelect={(label: string) => {
                        const selected = sortByOptions.find((opt) => opt.label === label);
                        if (selected) setDirection(selected.value);
                    }}
                />

                {/* Sorting Column */}
                <TableDropdown
                    buttonText="Sort By:"
                    items={sortingOptions.map((opt) => ({ label: opt.label }))}
                    value={sortingOptions.find((opt) => opt.value === sortBy)?.label}
                    onSelect={(label: string) => {
                        const selected = sortingOptions.find((opt) => opt.label === label);
                        if (selected) setSortBy(selected.value);
                    }}
                />
            </div>

            {loading ? (
                <p>Loading students...</p>
            ) : (
                <InformationTable
                    data={currentPageData}
                    columns={studentColumns}
                    pageIndex={pagination.pageIndex}
                    pageSize={pagination.pageSize}
                    totalCount={totalCount}
                    onPageChange={(page) =>
                        setPagination(prev => ({ ...prev, pageIndex: page }))
                    }
                    onPageSizeChange={(size) =>
                        setPagination(prev => ({ ...prev, pageSize: size }))
                    }
                    onPageCountChange={setPageCount}
                />
            )}

            <div className="d-flex p-2">
                <TablePagination
                    pageIndex={pagination.pageIndex}
                    pageCount={pageCount}
                    pageSize={pagination.pageSize}
                    onPageChange={(page) => setPagination(prev => ({ ...prev, pageIndex: page }))}
                    onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size }))}
                />
            </div>
        </div>
    );
}
