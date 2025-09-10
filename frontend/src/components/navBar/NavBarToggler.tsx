import { type ForwardedRef, forwardRef } from "react";

interface NavBarTogglerProps {
    isOpen: boolean;
    onToggle: () => void;
}

const NavBarToggler = forwardRef(function NavBarToggler(
    { isOpen, onToggle }: NavBarTogglerProps,
    ref: ForwardedRef<HTMLButtonElement>
) {
    return (
        <button
            ref={ref}
            className="navbar-toggler"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            onClick={onToggle}
        >
            <span className="navbar-toggler-icon"></span>
        </button>
    );
});

export default NavBarToggler;
