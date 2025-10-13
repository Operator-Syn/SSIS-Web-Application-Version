import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./InputForm.css"

interface InputFormProps {
    labels: string[];
    value?: string | string[];
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    onChange?: (index: number, newValue: string) => void;
    pattern?: RegExp;              // optional regex
    patternMessage?: string;       // message when invalid
    placeholder?: string | string[]; // optional placeholder
}

export default function InputForm(props: InputFormProps) {
    const {
        labels,
        value,
        disabled = false,
        readOnly = false,
        className,
        onChange,
        pattern,
        patternMessage = "Invalid format",
    } = props;

    // destructure optional placeholder separately
    const placeholder = props.placeholder;

    const [touched, setTouched] = useState<boolean[]>(labels.map(() => false));
    const [valid, setValid] = useState<boolean[]>(labels.map(() => true));

    useEffect(() => {
        // Update validity whenever value changes
        const newValid = labels.map((_, i) => {
            const val = Array.isArray(value) ? value[i] ?? "" : value ?? "";
            return pattern ? pattern.test(val) : true;
        });
        setValid(newValid);
    }, [value, labels, pattern]);

    return (
        <>
            {labels.map((label, i) => {
                const val = Array.isArray(value) ? value[i] ?? "" : value ?? "";
                const ph =
                    Array.isArray(placeholder)
                        ? placeholder[i] ?? `Enter ${label}`
                        : placeholder ?? `Enter ${label}`;

                return (
                    <Form.Group key={i} controlId={`input-${i}`} className="mb-md-3">
                        <Form.Label>{label}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={ph}
                            disabled={disabled}
                            readOnly={readOnly}
                            className={className}
                            value={val}
                            onChange={(e) => onChange?.(i, e.target.value)}
                            onBlur={() =>
                                setTouched((prev) => {
                                    const copy = [...prev];
                                    copy[i] = true;
                                    return copy;
                                })
                            }
                            isInvalid={touched[i] && !valid[i]}
                            isValid={touched[i] && valid[i]}
                        />
                        {pattern && touched[i] && !valid[i] && (
                            <Form.Control.Feedback type="invalid">
                                <strong>{patternMessage}</strong>
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                );
            })}
        </>
    );
}
