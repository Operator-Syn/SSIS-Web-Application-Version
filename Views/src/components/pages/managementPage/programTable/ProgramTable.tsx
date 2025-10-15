import { useEffect, useState, useCallback } from "react";
import InformationTable from "../../../dataTable/Table";
import SearchBar from "../../../searchBar/SearchBar";
import TableDropdown from "../../../dataTable/TableDropdown";
import TablePagination from "../../../dataTable/TablePagination";
import { sortByOptions, programColumns } from "../../../../data/Content";

export default function ProgramTable() {
    const [programsCache, setProgramsCache] = useState<{ [key: string]: any[] }>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [pageCount, setPageCount] = useState(0);
    const [direction, setDirection] = useState("ASC");
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const getCacheKey = (pageIndex: number, pageSize: number) => `${pageIndex}_${pageSize}`;

    const fetchPage = useCallback(async (pageIndex: number) => {
        const cacheKey = getCacheKey(pageIndex, pagination.pageSize);
        if (programsCache[cacheKey]) return;

        setLoading(true);
        try {
            const params = new URLSearchParams({
                order_by: "program_name", // sort by program_name by default
                direction: direction,
                limit: String(pagination.pageSize),
                offset: String(pageIndex * pagination.pageSize),
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

            setProgramsCache(prev => ({ ...prev, [cacheKey]: mapped }));
            setTotalCount(data.totalCount);
            setPageCount(Math.ceil(data.totalCount / pagination.pageSize));
        } catch (err) {
            console.error("Error fetching programs:", err);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize, direction, searchQuery, programsCache]);

    useEffect(() => {
        fetchPage(pagination.pageIndex);
        fetchPage(pagination.pageIndex + 1); // prefetch next
    }, [pagination.pageIndex, pagination.pageSize, fetchPage]);

    useEffect(() => {
        setProgramsCache({});
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [searchQuery, direction, pagination.pageSize]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const currentCacheKey = getCacheKey(pagination.pageIndex, pagination.pageSize);
    const currentPageData = programsCache[currentCacheKey] ?? [];

    return (
        <div className="program-data-page">
            {/* Filters Row */}
            <div className="d-flex flex-column flex-md-row gap-3 mb-3">
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search by Program Code, Program Name, or College..."
                />

                <TableDropdown
                    buttonText="Sort Direction:"
                    items={sortByOptions.map(opt => ({ label: opt.label }))}
                    value={sortByOptions.find(opt => opt.value === direction)?.label}
                    onSelect={label => {
                        const selected = sortByOptions.find(opt => opt.label === label);
                        if (selected) setDirection(selected.value);
                    }}
                />
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading programs...</p>
            ) : (
                <InformationTable
                    data={currentPageData}
                    columns={programColumns}
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
