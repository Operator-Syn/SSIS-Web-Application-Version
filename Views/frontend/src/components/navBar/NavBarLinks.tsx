import { NavLink } from "react-router-dom";
import type { NavLinkItem } from "../../data/Content";

export default function NavBarLinks({
    links,
    onLinkClick,
}: {
    links: NavLinkItem[];
    onLinkClick?: () => void;
}) {

    return (
        <ul className="navbar-nav ms-auto">
            {links.map((link) => (
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
    );
}
