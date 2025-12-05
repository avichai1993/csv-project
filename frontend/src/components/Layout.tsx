/**
 * Layout Component
 *
 * Provides consistent layout wrapper with navigation header.
 */

import type { ReactNode } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/">
            Target Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/targets"
                active={location.pathname === "/targets"}
              >
                Targets
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1 px-4">{children}</Container>

      <footer className="bg-light py-3 mt-4">
        <Container fluid className="px-4">
          <p className="text-muted text-center mb-0">
            Target Management System v1.0.0
          </p>
        </Container>
      </footer>
    </div>
  );
}
