import { useState, useEffect } from "react";
import './SearchBar.css';

type SearchBarProps = {
    onSearch?: (query: string) => void; // callback when user types
    placeholder?: string;              // customizable placeholder text
    className?: string;                // optional additional CSS classes
};

export default function SearchBar({ onSearch, placeholder = "Search...", className = "" }: SearchBarProps) {
    const [inputValue, setInputValue] = useState("");

    // Debounce input changes
    useEffect(() => {
        const handler = setTimeout(() => {
            if (onSearch) onSearch(inputValue.trim());
        }, 240); // debounce 240ms
        return () => clearTimeout(handler);
    }, [inputValue, onSearch]);

    return (
        <div className={`d-flex flex-grow-1 search-bar ${className}`}>
            <i className="bi bi-search search-icon"></i>
            <input
                className="form-control"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}
