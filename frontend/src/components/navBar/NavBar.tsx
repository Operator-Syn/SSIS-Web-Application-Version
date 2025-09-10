import NavBarBrand from "./NavBarBrand";
import NavBarCollapse from "./NavBarCollapse";
import "./NavBar.css";

export default function NavBar() {
    return (
        <nav className="navbar fixed-top navbar-expand-xxl glass">
            <div className="container-fluid">
                <NavBarBrand />
                <NavBarCollapse />
            </div>
        </nav>
    );
}
