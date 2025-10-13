import type { Header } from "@tanstack/react-table";

interface ColumnResizerProps<T> {
    header: Header<T, any>;
}

export function ColumnResizer<T>({ header }: ColumnResizerProps<T>) {
    const isResizing = header.column.getIsResizing();
    const handleResize = header.getResizeHandler();

    return (
        <div
            onMouseDown={handleResize}
            onTouchStart={handleResize}
            className={`resizer ${isResizing ? "isResizing" : ""}`}
        />
    );
}
