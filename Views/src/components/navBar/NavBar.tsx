import { Navbar, Container, Nav } from "react-bootstrap";
import NavBarBrand from "./NavBarBrand";
import { navLinks } from "../../data/Content";
import { useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css"

export default function NavBar() {
    const location = useLocation(); // <-- watch router location
    const navigate = useNavigate();

    return (
        <Navbar expand="xxl" fixed="top" className="glass">
            <Container fluid>
                <NavBarBrand onClick={() => navigate("/")} />

                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto" activeKey={location.pathname}>
                        {navLinks.map((link) => (
                            <Nav.Link
                                key={link.path}
                                href={link.path}
                                eventKey={link.path}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(link.path);
                                }}
                            >
                                {link.name}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
