import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import AlertBanner from "../../alertBanner/AlertBanner";

export default function HomePage() {
    const location = useLocation();

    // Alert state
    const [alert, setAlert] = useState({
        show: false,
        type: "info" as "info" | "success" | "danger" | "warning",
        title: "Notice",
        message: "",
        buttons: [] as {
            label: string;
            variant?: string;
            onClick?: () => void;
            closeOnClick?: boolean;
        }[],
    });

    const showAlert = (
        type: "info" | "success" | "danger" | "warning",
        message: string,
        buttons?: {
            label: string;
            variant?: string;
            onClick?: () => void;
            closeOnClick?: boolean;
        }[],
        title?: string
    ) => {
        setAlert({
            show: true,
            type,
            title: title || "Notice",
            message,
            buttons: buttons || [{ label: "Close", variant: type, closeOnClick: true }],
        });
    };

    /** Handle logout with custom alert */
    const handleLogout = () => {
        showAlert(
            "warning",
            "Are you sure you want to logout?",
            [
                { label: "Cancel", variant: "secondary", closeOnClick: true },
                {
                    label: "Logout",
                    variant: "danger",
                    onClick: async () => {
                        try {
                            const response = await fetch("/api/logout", {
                                method: "POST",
                                credentials: "include",
                                headers: { "Content-Type": "application/json" },
                            });
                            const data = await response.json();

                            if (data.success) {
                                window.location.href = "/login";
                            } else {
                                showAlert("danger", data.message || "Logout failed.");
                            }
                        } catch (err) {
                            console.error("Logout failed:", err);
                            showAlert("danger", "Logout failed. Check console for details.");
                        }
                    },
                    closeOnClick: true,
                },
            ],
            "Confirm Logout"
        );
    };

    const cards = [
        { title: "Student Information", path: "/student/information" },
        { title: "College Information", path: "/colleges" },
        { title: "Programs Information", path: "/programs" },
    ];

    return (
        <div className="container py-4 text-center">
            <AlertBanner
                message={alert.message}
                type={alert.type}
                title={alert.title}
                show={alert.show}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                buttons={alert.buttons}
            />

            <h1 className="mb-4">Welcome to the Home Page</h1>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5 justify-content-center">
                {cards.map((card) => {
                    const isActive = location.pathname === card.path;
                    return (
                        <div className="col" key={card.path}>
                            <NavLink to={card.path} end className="text-decoration-none">
                                <div
                                    className={`card h-100 shadow-sm ${isActive ? "current" : ""}`}
                                    role="button"
                                >
                                    {/* Reduced minHeight and added p-3 for smaller size */}
                                    <div className="card-body d-flex align-items-center justify-content-center p-3" style={{ minHeight: "100px" }}>
                                        <h5 className="card-title m-0">{card.title}</h5>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    );
                })}
            </div>

            <div className="d-flex justify-content-center">
                <button className="btn btn-danger btn-lg px-5" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}