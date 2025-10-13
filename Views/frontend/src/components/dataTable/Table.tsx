import { useEffect } from "react";
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { ColumnResizer } from "./ColumnResizer";
import "./Table.css";

interface TableProps<TData> {
    data: TData[];
    columns: any[];
    pageIndex: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onPageCountChange: (count: number) => void;
}

export default function Table<TData>(props: TableProps<TData>) {
    const {
        data,
        columns,
        pageIndex,
        pageSize,
        onPageChange,
        onPageSizeChange,
        onPageCountChange
    } = props;

    const table = useReactTable({
        data,
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
        getPaginationRowModel: getPaginationRowModel(),
        columnResizeMode: "onChange",
    });

    useEffect(() => {
        onPageCountChange(table.getPageCount());
    }, [table.getPageCount(), onPageCountChange]);

    return (
        <div className="table-wrapper">
            <div className="table-container">
                <table className="table table-bordered table-striped table-hover align-middle">
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
                    </tbody>
                </table>
            </div>
        </div>
    );
}
