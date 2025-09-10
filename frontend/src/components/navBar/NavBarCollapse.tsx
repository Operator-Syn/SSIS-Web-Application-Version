import { useState, useEffect, useRef, Fragment } from "react";
import { Collapse } from "bootstrap";
import NavBarToggler from "./NavBarToggler";
import NavBarMobile from "./NavBarMobile";

export default function NavBarCollapse() {
    const [isOpen, setIsOpen] = useState(false);
    const isOpenRef = useRef(isOpen);
    const collapseRef = useRef<HTMLDivElement>(null);
    const togglerRef = useRef<HTMLButtonElement>(null);
    const collapseInstanceRef = useRef<Collapse | null>(null);

    // Initialize Bootstrap Collapse
    useEffect(() => {
        if (collapseRef.current) {
            collapseInstanceRef.current = new Collapse(collapseRef.current, { toggle: false });
        }
    }, []);

    useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpenRef.current &&
                collapseRef.current &&
                !collapseRef.current.contains(event.target as Node) &&
                togglerRef.current &&
                !togglerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Sync collapse with state
    useEffect(() => {
        if (!collapseInstanceRef.current) return;
        isOpen ? collapseInstanceRef.current.show() : collapseInstanceRef.current.hide();
    }, [isOpen]);

    return (
        <Fragment>
            <NavBarToggler
                ref={togglerRef}
                isOpen={isOpen}
                onToggle={() => setIsOpen(!isOpen)}
            />
            <NavBarMobile
                ref={collapseRef}
                onLinkClick={() => setIsOpen(false)}
            />
        </Fragment>
    );
}
