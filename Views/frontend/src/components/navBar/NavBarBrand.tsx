import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { brandName, Logo, type NavBarBrandProps } from "../../data/Content";

export default function NavBarBrand({ logoSrc = Logo.logoSrc, logoAlt = Logo.logoAlt, onClick }: NavBarBrandProps) {
    return (
        <Navbar.Brand as={Link} to="/" onClick={onClick} className="d-flex align-items-center gap-2 text-truncate responsive-width">
            {logoSrc && (
                <img
                    src={logoSrc}
                    alt={logoAlt ?? brandName}
                    height="40"
                    className="d-inline-block align-text-top"
                />
            )}
            <span>{brandName}</span>
        </Navbar.Brand>
    );
}
