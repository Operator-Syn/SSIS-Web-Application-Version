import { useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import NavBarBrand from "./NavBarBrand";
import { navLinks } from "../../data/Content";
import "./NavBar.css"

export default function NavBar() {
    const [active, setActive] = useState(window.location.pathname);

    return (
        <Navbar expand="xxl" fixed="top" className="glass">
            <Container fluid>
                <NavBarBrand onClick={() => setActive("/")} />

                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav
                        className="ms-auto"
                        activeKey={active}
                        onSelect={(eventKey) => eventKey && setActive(eventKey)}
                    >
                        {navLinks.map((link) => (
                            <Nav.Link key={link.path} href={link.path} eventKey={link.path}>
                                {link.name}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
