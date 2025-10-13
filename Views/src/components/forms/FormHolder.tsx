import { Row, Col } from "react-bootstrap";
import { type ReactNode } from "react";

interface FormHolderProps {
    children: ReactNode | ReactNode[]; // allow single or multiple children
    className?: string;                // optional className
    centerSingle?: boolean;            // optionally center single child
}

export default function FormHolder({ children, className = "", centerSingle = false }: FormHolderProps) {
    // Ensure children is always an array
    const childArray = Array.isArray(children) ? children : [children];

    // Determine if we should center single child
    const shouldCenter = centerSingle && childArray.length === 1;

    return (
        <Row className={`g-3 ${shouldCenter ? "justify-content-center" : "justify-content-between"} ${className}`}>
            {childArray.map((child, i) => (
                <Col key={i} xs={12} md={4}>
                    {child}
                </Col>
            ))}
        </Row>
    );
}
