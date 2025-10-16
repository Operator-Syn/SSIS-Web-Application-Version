import { useEffect } from "react";
import { useReactTable, flexRender, getCoreRowModel } from "@tanstack/react-table";
import { ColumnResizer } from "./ColumnResizer";
import "./Table.css";

interface TableProps<TData> {
    data: TData[] | null;
    columns: any[];
    pageIndex: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onPageCountChange: (count: number) => void; // total pages from server
    totalCount?: number; // add this prop
}

export default function Table<TData>(props: TableProps<TData>) {
    const {
        data = [],
        columns,
        pageIndex,
        pageSize,
        onPageChange,
        onPageSizeChange,
        onPageCountChange,
        totalCount = 0,
    } = props;

    const table = useReactTable({
        data: data ?? [],
        columns,
        state: { pagination: { pageIndex, pageSize } },
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                const newState = updater({ pageIndex, pageSize });
                onPageChange(newState.pageIndex);
                onPageSizeChange(newState.pageSize);
            } else {
                onPageChange(updater.pageIndex);
                onPageSizeChange(updater.pageSize);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        manualPagination: true, // <-- important for server-side
    });

    useEffect(() => {
        onPageCountChange(Math.ceil(totalCount / pageSize)); // update page count based on server total
    }, [totalCount, pageSize, onPageCountChange]);

    return (
        <div className="table-wrapper">
            <div className="table-container">
                <table className="table table-bordered table-striped table-hover align-middle student-table">
                    <thead className="table-dark">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} style={{ width: header.getSize() }}>
                                        <div className="text-truncate w-100 d-inline-block">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </div>
                                        <ColumnResizer header={header} />
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
                        {table.getRowModel().rows.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="text-center">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
