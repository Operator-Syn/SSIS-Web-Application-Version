// AlertBanner.tsx
import { Modal, Button } from "react-bootstrap";

export interface AlertBannerProps {
    message: string;
    show: boolean;
    onClose: () => void;
    type?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
    title?: string;
    className?: string;

    // Dynamic button options
    buttons?: {
        label: string;
        variant?: string;
        onClick?: () => void;
        closeOnClick?: boolean; // optional flag to auto-close after click
    }[];
}

export default function AlertBanner({
    message,
    show,
    onClose,
    type = "info",
    title = "Notice",
    className = "",
    buttons,
}: AlertBannerProps) {
    const defaultButtons = [
        {
            label: "Close",
            variant: type,
            onClick: onClose,
        },
    ];

    const renderedButtons = buttons && buttons.length > 0 ? buttons : defaultButtons;

    const handleClick = (btn: {
        onClick?: () => void;
        closeOnClick?: boolean;
    }) => {
        if (btn.onClick) btn.onClick();
        if (btn.closeOnClick || !btn.onClick) onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered className={className}>
            <Modal.Header closeButton className={`bg-${type} text-white`}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{message}</Modal.Body>

            <Modal.Footer>
                {renderedButtons.map((btn, idx) => (
                    <Button
                        key={idx}
                        variant={btn.variant || "secondary"}
                        onClick={() => handleClick(btn)}
                    >
                        {btn.label}
                    </Button>
                ))}
            </Modal.Footer>
        </Modal>
    );
}
