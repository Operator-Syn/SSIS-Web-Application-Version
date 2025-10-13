import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

interface DropdownItem {
    label: string;
    onClick?: () => void;
}

interface TableDropdownProps {
    buttonText: string;
    items: DropdownItem[];
}

export default function TableDropdown({ buttonText, items }: TableDropdownProps) {
    const [selected, setSelected] = useState<string>("");

    useEffect(() => {
        if (items.length > 0) setSelected(items[0].label);
    }, [items]);

    const handleSelect = (value: string) => {
        setSelected(value);
        const item = items.find((i) => i.label === value);
        item?.onClick?.();
    };

    return (
        <Form.Group className="d-flex align-items-center gap-2">
            {/* Static label */}
            <span className="fw-bold text-nowrap">{buttonText}</span>

            {/* Combobox */}
            <Form.Select
                value={selected}
                onChange={(e) => handleSelect(e.target.value)}
            >
                {items.map((item, index) => (
                    <option key={index} value={item.label}>
                        {item.label}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
}
