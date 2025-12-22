import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./InputForm.css";

interface InputFormProps {
    labels: string[];
    value?: string | string[];
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    onChange?: (index: number, newValue: string) => void;
    pattern?: RegExp;
    patternMessage?: string;
    placeholder?: string | string[];
    onBlur?: () => void | Promise<void>;
    datalistOptions?: string[] | string[][]; 
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
        placeholder,
        datalistOptions,
    } = props;

    const [touched, setTouched] = useState<boolean[]>(labels.map(() => false));
    const [valid, setValid] = useState<boolean[]>(labels.map(() => true));

    useEffect(() => {
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
                const ph = Array.isArray(placeholder)
                    ? placeholder[i] ?? `Enter ${label}`
                    : placeholder ?? `Enter ${label}`;

                const datalistId = `datalist-${label.replace(/\s+/g, "-").toLowerCase()}-${i}`;

                const list =
                    Array.isArray(datalistOptions) && Array.isArray(datalistOptions[0])
                        ? (datalistOptions as string[][])[i]
                        : (datalistOptions as string[] | undefined);

                return (
                    // ADDED: w-100 to ensure the container spans full width
                    <Form.Group key={i} controlId={`input-${i}`} className="mb-md-3 w-100">
                        <Form.Label>{label}</Form.Label>
                        <Form.Control
                            type="text"
                            list={list ? datalistId : undefined}
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

                        {list && (
                            <datalist id={datalistId}>
                                {list.map((option, idx) => (
                                    <option key={idx} value={option} />
                                ))}
                            </datalist>
                        )}

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