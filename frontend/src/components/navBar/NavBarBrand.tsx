import { Fragment } from "react";
import { Link } from "react-router-dom";
import { brandName, Logo, type NavBarBrandProps } from "../../data/Content";

export default function NavBarBrand({
    logoSrc = Logo.logoSrc,
    logoAlt = Logo.logoAlt,
}: NavBarBrandProps) {
    return (
        <Fragment>
            <Link className="navbar-brand d-flex align-items-center gap-2 text-truncate responsive-width" to="/">
                {logoSrc && (
                    <img
                        src={logoSrc}
                        alt={logoAlt ?? brandName}
                        height="40"
                        className="d-inline-block align-text-top"
                    />
                )}
                <span>{brandName}</span>
            </Link>
        </Fragment>
    );
}
