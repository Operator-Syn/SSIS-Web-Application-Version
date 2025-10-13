import { Form } from "react-bootstrap";

interface SelectOption {
    label: string;
    value: string;
}
interface SelectFormProps {
    label: string;
    options?: SelectOption[] | null;
    value?: string;
    onChange?: (value: string) => void;
}

export default function SelectForm({ label, options, value, onChange }: SelectFormProps) {
    return (
        <Form.Group controlId={`select-${label}`} className="mb-md-3">
            <Form.Label>{label}</Form.Label>
            <Form.Select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}>
                <option value="">Select {label}</option>
                {(options ?? []).map((option, i) => (
                    <option key={i} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
}
