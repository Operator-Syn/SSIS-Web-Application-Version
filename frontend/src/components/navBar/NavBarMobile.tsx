import { type ForwardedRef, forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { navLinks } from "../../data/Content";

interface NavBarMobileProps {
    onLinkClick: () => void;
}

const NavBarMobile = forwardRef(function NavBarMobile(
    { onLinkClick }: NavBarMobileProps,
    ref: ForwardedRef<HTMLDivElement>
) {
    return (
        <div ref={ref} className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
                {navLinks.map((link) => (
                    <li key={link.path} className="nav-item">
                        <NavLink
                            to={link.path}
                            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                            onClick={onLinkClick}
                        >
                            {link.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default NavBarMobile;
