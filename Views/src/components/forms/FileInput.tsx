import { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

interface FileInputProps {
    label: string;
    value?: File | null;
    disabled?: boolean;
    className?: string;
    onChange?: (file: File | null) => void;
    accept?: string;
    showAlert?: (type: "info" | "success" | "danger" | "warning", message: string) => void;
    maxSizeMB?: number;
}

export default function FileInput(props: FileInputProps) {
    const { label, value, disabled = false, className, onChange, accept, showAlert, maxSizeMB = 5 } = props;
    const [selectedFile, setSelectedFile] = useState<File | null>(value ?? null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Track previous value to detect external resets
    const prevValueRef = useRef<File | null | undefined>(value);

    useEffect(() => {
        // Only sync if value changed externally (like reset to null)
        if (prevValueRef.current !== value) {
            setSelectedFile(value ?? null);

            // Clear the input visually if parent reset
            if (!value && inputRef.current) {
                inputRef.current.value = "";
            }

            prevValueRef.current = value;
        }
    }, [value]);

    const handleChange = (file: File | null) => {
        setSelectedFile(file);
        onChange?.(file);
    };

    const handleFileSelect = (input: HTMLInputElement) => {
        const file = input.files?.[0] ?? null;

        if (!file) {
            handleChange(null);
            return;
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSize = maxSizeMB * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            showAlert?.("warning", "Only PNG, JPG, and JPEG files are allowed.");
            input.value = "";
            handleChange(null);
            return;
        }

        if (file.size > maxSize) {
            showAlert?.("warning", `File size cannot exceed ${maxSizeMB}MB.`);
            input.value = "";
            handleChange(null);
            return;
        }

        handleChange(file);
    };

    return (
        <Form.Group controlId="file-input" className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                ref={inputRef}
                type="file"
                disabled={disabled}
                accept={accept}
                className={className}
                onChange={(e) => handleFileSelect(e.target as HTMLInputElement)}
            />
            {selectedFile ? (
                <div className="mt-2 text-center">Selected file: {selectedFile.name}</div>
            ) : (
                <div className="mt-2 text-center text-muted">No file selected</div>
            )}
        </Form.Group>
    );
}
