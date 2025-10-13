import "./HeaderToolbar.css";

interface ToolbarButton {
    label: string;
    onClick?: () => void;
}

interface HeaderToolbarProps {
    leftText: string;
    rightButtons: ToolbarButton[];
    dropdownLabel?: string; // optional
}

export default function HeaderToolbar({
    leftText,
    rightButtons,
    dropdownLabel = "Menu", // default value
}: HeaderToolbarProps) {
    return (
        <>
            <div className="btn-toolbar justify-content-between align-items-center text-white" role="toolbar">
                {/* Left dynamic text */}
                <div className="d-flex align-items-center">
                    <h1 className="m-0">{leftText}</h1>
                </div>

                {/* Right buttons (visible on md and above) */}
                <div className="btn-group gap-2 d-none d-md-flex" role="group">
                    {rightButtons.map((btn, index) => (
                        <button
                            key={index}
                            type="button"
                            className="btn btn-yellow-flat"
                            onClick={btn.onClick}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Dropdown (visible below md) */}
                <div className="dropdown d-md-none">
                    <button
                        className="btn btn-yellow-flat dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {dropdownLabel}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        {rightButtons.map((btn, index) => (
                            <li key={index}>
                                <button className="dropdown-item" onClick={btn.onClick}>
                                    {btn.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <hr className="thick-divider" />
        </>
    );
}
