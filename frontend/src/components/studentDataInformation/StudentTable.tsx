import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { useState } from "react";
import { students as tableData, studentColumns as tableColumnData} from "../../data/Content";
import "./StudentTable.css";

export default function StudentTable() {

    const [data, setData] = useState(tableData);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const table = useReactTable({
        data,
        columns: tableColumnData,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="table-wrapper">
            <div className="table-container">
                <table className="table table-bordered table-striped table-hover align-middle student-table">
                    <thead className="table-dark">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} scope="col">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center p-2">
                <div>
                    <strong>
                        Page{" "}
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </div>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>

                <select
                    className="form-select form-select-sm w-auto"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
