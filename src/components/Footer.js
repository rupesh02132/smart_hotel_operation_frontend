import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 3,
        background:
          "linear-gradient(135deg, rgba(15,32,39,0.95), rgba(32,58,67,0.95))",
        color: "white",
        borderTop: "2px solid #4fc3f7",
      }}
    >
      <Container>
        <Row className="text-center text-md-start">

          <Col md={4} className="mb-2">
            <h6>SmartHotel</h6>
            <p className="small">
              Smart hotel operations platform for modern hospitality management.
            </p>
          </Col>

          <Col md={4} className="mb-2">
            <h6>Quick Links</h6>
            <ul className="list-unstyled small">
              <li>Home</li>
              <li>Bookings</li>
              <li>Check-In</li>
              <li>Contact</li>
            </ul>
          </Col>

          <Col md={4} className="mb-2">
            <h6>Support</h6>
            <p className="small">
              Email: support@smarthotel.com <br />
              Phone: +91-9876543210
            </p>
          </Col>

        </Row>

        <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <div className="text-center small">
          © {new Date().getFullYear()} SmartHotel. All rights reserved.
        </div>
      </Container>
    </Box>
  );
};

export default Footer;
