import { useState } from "react";
import "./Tabs.css";

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
    className?: string; // optional class for the tab content pane
    defaultActiveId?: string;
}

interface TabsProps {
    tabs: Tab[];
    className?: string; // optional class for the nav header
    defaultActiveId?: string;
    onTabChange?: (id: string) => void;
}

export default function Tabs({ tabs, className }: TabsProps) {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const activeTabData = tabs.find((tab) => tab.id === activeTab);

    return (
        <div>
            {/* Tab headers */}
            <strong>
                <ul className={`nav nav-tabs ${className || ""}`} role="tablist">
                    {tabs.map((tab) => (
                        <li className="nav-item" role="presentation" key={tab.id}>
                            <button
                                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                                id={`${tab.id}-tab`}
                                type="button"
                                role="tab"
                                aria-controls={tab.id}
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </strong>

            {/* Tab content */}
            <div className="tab-content mt-2">
                {activeTabData && (
                    <div
                        key={activeTabData.id}
                        className={`tab-pane fade show active ${activeTabData.className || ""}`}
                        id={activeTabData.id}
                        role="tabpanel"
                        aria-labelledby={`${activeTabData.id}-tab`}
                    >
                        {activeTabData.content}
                    </div>
                )}
            </div>
        </div>
    );
}
