import { Navbar, Container, Nav } from "react-bootstrap";
import NavBarBrand from "./NavBarBrand";
import { navLinks } from "../../data/Content";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./NavBar.css"

export default function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const navbarRef = useRef<HTMLDivElement>(null);

    const handleNavClick = (path: string) => {
        navigate(path);
        setExpanded(false);
    };

    // Close navbar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
                setExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Navbar ref={navbarRef} expand="xxl" fixed="top" className="glass" expanded={expanded}>
            <Container fluid>
                <NavBarBrand onClick={() => handleNavClick("/")} />

                <Navbar.Toggle
                    aria-controls="navbar-nav"
                    onClick={() => setExpanded(prev => !prev)}
                />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto" activeKey={location.pathname}>
                        {navLinks.map((link) => (
                            <Nav.Link
                                key={link.path}
                                eventKey={link.path}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(link.path);
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
