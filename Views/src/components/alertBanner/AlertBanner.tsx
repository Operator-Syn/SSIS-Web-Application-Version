// AlertBanner.tsx
import { Modal, Button } from "react-bootstrap";

interface AlertBannerProps {
    message: string;
    show: boolean;
    onClose: () => void;
    type?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
    title?: string;
    className?: string;
}

export default function NoticeBanner({
    message,
    show,
    onClose,
    type = "info",
    title = "Notice",
    className,
}: AlertBannerProps) {
    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            className={className}
        >
            <Modal.Header closeButton className={`bg-${type} text-white`}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant={type} onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
