import { useEffect, useState, useCallback } from "react";
import InformationTable from "../../../dataTable/Table";
import SearchBar from "../../../searchBar/SearchBar";
import TableDropdown from "../../../dataTable/TableDropdown";
import TablePagination from "../../../dataTable/TablePagination";
import { sortByOptions, collegeColumns } from "../../../../data/Content";

export default function CollegeTable() {
    const [collegesCache, setCollegesCache] = useState<{ [key: string]: any[] }>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [pageCount, setPageCount] = useState(0);
    const [direction, setDirection] = useState("ASC");
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const getCacheKey = (pageIndex: number, pageSize: number) => `${pageIndex}_${pageSize}`;

    const fetchPage = useCallback(async (pageIndex: number) => {
        const cacheKey = getCacheKey(pageIndex, pagination.pageSize);
        if (collegesCache[cacheKey]) return;

        setLoading(true);

        try {
            const params = new URLSearchParams({
                order_by: "college_name", // ensure backend receives this
                direction: direction,
                limit: String(pagination.pageSize),
                offset: String(pageIndex * pagination.pageSize),
            });
            if (searchQuery) params.append("q", searchQuery);

            const res = await fetch(`/api/colleges/search?${params.toString()}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            // map API response to camelCase for table
            const mapped = data.rows.map((c: any) => ({
                collegeCode: c.college_code,
                collegeName: c.college_name,
            }));

            setCollegesCache(prev => ({ ...prev, [cacheKey]: mapped }));
            setTotalCount(data.totalCount);
            setPageCount(Math.ceil(data.totalCount / pagination.pageSize));
        } catch (err) {
            console.error("Error fetching colleges:", err);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize, direction, searchQuery, collegesCache]);

    useEffect(() => {
        fetchPage(pagination.pageIndex);
        fetchPage(pagination.pageIndex + 1); // prefetch next
    }, [pagination.pageIndex, pagination.pageSize, fetchPage]);

    useEffect(() => {
        setCollegesCache({});
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [searchQuery, direction, pagination.pageSize]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const currentCacheKey = getCacheKey(pagination.pageIndex, pagination.pageSize);
    const currentPageData = collegesCache[currentCacheKey] ?? [];

    return (
        <div className="college-data-page">
            <div className="d-flex flex-column flex-md-row gap-3 mb-3">
                <SearchBar onSearch={handleSearch} placeholder="Search by College Code or College Name..." />

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

            {loading ? (
                <p>Loading colleges...</p>
            ) : (
                <InformationTable
                    data={currentPageData}
                    columns={collegeColumns}
                    pageIndex={pagination.pageIndex}
                    pageSize={pagination.pageSize}
                    totalCount={totalCount}
                    onPageChange={page => setPagination(prev => ({ ...prev, pageIndex: page }))}
                    onPageSizeChange={size => setPagination(prev => ({ ...prev, pageSize: size }))}
                    onPageCountChange={setPageCount}
                />
            )}

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
