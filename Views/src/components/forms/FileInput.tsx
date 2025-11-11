import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

interface FileInputProps {
    label: string;
    value?: File | null;
    disabled?: boolean;
    className?: string;
    onChange?: (file: File | null) => void;
    accept?: string;
}

export default function FileInput(props: FileInputProps) {
    const { label, value, disabled = false, className, onChange, accept } = props;
    const [selectedFile, setSelectedFile] = useState<File | null>(value ?? null);

    useEffect(() => {
        setSelectedFile(value ?? null);
    }, [value]);

    const handleChange = (file: File | null) => {
        setSelectedFile(file);
        onChange?.(file);
    };

    return (
        <Form.Group controlId="file-input" className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type="file"
                disabled={disabled}
                accept={accept}
                className={className}
                onChange={(e) => {
                    const input = e.target as HTMLInputElement; 
                    handleChange(input.files?.[0] ?? null);
                }}
            />
            {selectedFile ? (
                <div className="mt-2 text-center">Selected file: {selectedFile.name}</div>
            ) : (
                <div className="mt-2 text-center text-muted">No file selected</div>
            )}
        </Form.Group>
    );
}
