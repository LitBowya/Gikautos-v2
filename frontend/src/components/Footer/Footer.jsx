// src/components/Footer.js
import React from "react";
import { Container, Row, Col, Nav, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import FooterCss from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={FooterCss.footer}>
      <Container>
        <Row className="text-md-left">
          <Col xs={12} md={3}>
            <div className={FooterCss.logo}>
              <Logo />
            </div>
          </Col>

          {/* Navigation Links Section 1 */}
          <Col xs={12} md={3} className={`${FooterCss.navContainer} mb-3`}>
            <h3>Pages</h3>
            <Nav className={`${FooterCss.navLinks} flex-column`}>
              <Nav.Link as={Link} to="/home" className={FooterCss.navLink}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className={FooterCss.navLink}>
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/services" className={FooterCss.navLink}>
                Cart
              </Nav.Link>
              <Nav.Link as={Link} to="/services" className={FooterCss.navLink}>
                Wishlist
              </Nav.Link>
              <Nav.Link as={Link} to="/services" className={FooterCss.navLink}>
                Mechanics
              </Nav.Link>
              <Nav.Link as={Link} to="/services" className={FooterCss.navLink}>
                Chat Page
              </Nav.Link>
            </Nav>
          </Col>

          {/* Navigation Links Section 2 */}
          <Col xs={12} md={3} className={`${FooterCss.navContainer} mb-3`}>
            <h3>Categories</h3>
            <Nav className={`${FooterCss.navLinks} flex-column`}>
              <Nav.Link as={Link} to="/contact" className={FooterCss.navLink}>
                Lubricants
              </Nav.Link>
              <Nav.Link as={Link} to="/faq" className={FooterCss.navLink}>
                Filters
              </Nav.Link>
              <Nav.Link as={Link} to="/support" className={FooterCss.navLink}>
                Batteries
              </Nav.Link>
              <Nav.Link as={Link} to="/support" className={FooterCss.navLink}>
                Belts
              </Nav.Link>
            </Nav>
          </Col>

          {/* Newsletter Subscription Section */}
          <Col xs={12} md={3} className={`${FooterCss.navContainer} mb-3`}>
            <h4>Subscribe to our Newsletter</h4>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  className="mb-2"
                />
              </Form.Group>
              <div className={FooterCss.btn}>
                <Button type="submit">
                  Subscribe
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
      <div className={`text-center ${FooterCss.copyright}`}>
        Copyright {currentYear}
      </div>
    </footer>
  );
};

export default Footer;
