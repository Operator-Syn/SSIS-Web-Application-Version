import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

interface DropdownItem {
    label: string;
}

interface TableDropdownProps {
    buttonText: string;
    items: DropdownItem[];
    value?: string; // <- add optional controlled value
    onSelect?: (value: string) => void;
}


export default function TableDropdown({ buttonText, items, value, onSelect }: TableDropdownProps) {
    const [selected, setSelected] = useState<string>("");

    useEffect(() => {
        if (items.length > 0 && !value) setSelected(items[0].label);
    }, [items, value]);

    const handleSelect = (val: string) => {
        if (!value) setSelected(val); // only update internal state if uncontrolled
        onSelect?.(val);
    };

    return (
        <Form.Group className="d-flex align-items-center gap-2">
            <span className="fw-bold text-nowrap">{buttonText}</span>
            <Form.Select
                value={value ?? selected} // controlled if value provided
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

