import { useState, useEffect } from "react";
import { Pagination, Form, Row, Col } from "react-bootstrap";
import "./Table.css";
import { type PaginationProperties as PaginationProps } from "../../data/Pagination";

interface ExtendedPaginationProps extends PaginationProps {
    pageSizeOptions?: number[];
}

export default function TablePagination(props: ExtendedPaginationProps) {
    const {
        pageIndex,
        pageCount,
        pageSize,
        onPageChange,
        onPageSizeChange,
        pageSizeOptions,
    } = props;

    // default inside function
    const sizeOptions = pageSizeOptions ?? [5, 10, 20, 50];

    const [inputValue, setInputValue] = useState((pageIndex + 1).toString());

    useEffect(() => {
        setInputValue((pageIndex + 1).toString());
    }, [pageIndex]);

    const handleInputChange = (val: string) => {
        if (val === "") {
            setInputValue(val);
            return;
        }

        const num = Number(val);
        if (!isNaN(num)) {
            if (num > pageCount) {
                setInputValue(pageCount.toString());
                onPageChange(pageCount - 1);
            } else if (num < 1) {
                setInputValue(val);
            } else {
                setInputValue(val);
                onPageChange(num - 1);
            }
        }
    };

    const handleBlurOrEnter = () => {
        let num = Number(inputValue);
        if (isNaN(num) || num < 1) num = 1;
        if (num > pageCount) num = pageCount;
        setInputValue(num.toString());
        onPageChange(num - 1);
    };

    return (
        <Row className="align-items-center g-2 w-100 pagination-wrapper">
            {/* Left: Page info */}
            <Col xs="12" md="4" className="m-0 text-start page-info">
                <strong>
                    Page {pageIndex + 1} of {pageCount}
                </strong>
            </Col>

            {/* Center: Prev / Page selector / Next */}
            <Col xs="12" md="4" className="d-flex justify-content-center m-0">
                <Pagination className="m-0 gap-1">
                    <Pagination.Prev
                        linkClassName="text-dark"
                        onClick={() => onPageChange(pageIndex - 1)}
                        disabled={pageIndex === 0}
                    >
                        Previous
                    </Pagination.Prev>

                    <Form.Control
                        type="number"
                        size="sm"
                        min={1}
                        max={pageCount}
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onBlur={handleBlurOrEnter}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleBlurOrEnter();
                        }}
                        className="page-jump text-dark"
                    />

                    <Pagination.Next
                        linkClassName="text-dark"
                        onClick={() => onPageChange(pageIndex + 1)}
                        disabled={pageIndex >= pageCount - 1}
                    >
                        Next
                    </Pagination.Next>
                </Pagination>
            </Col>

            {/* Right: Page size selector */}
            <Col xs="12" md="4" className="d-flex justify-content-md-end justify-content-start">
                <Form.Select
                    size="sm"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="page-size"
                >
                    {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </Form.Select>
            </Col>
        </Row>
    );
}
