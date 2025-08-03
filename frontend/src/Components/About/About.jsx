import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./About.css";
import charactor from "../../../public/girl-base.png";

const About = () => {
  return (
    <div className="about">
      <Container>
        <Row>
          <Col>
            <div>
              <div className="logo">
                <span style={{ color: "black" }}>Home</span>
                <span style={{ color: "green" }}>Servo</span>
              </div>
              <div className="charactor">
                <img src={charactor} alt="Character Image" />
              </div>
            </div>
          </Col>
          <Col>
            <h2>Our Vision</h2>
            <p>To become the most trusted platform for connecting customers with skilled professionals.</p>

            <h2>Our Mission</h2>
            <p>We aim to simplify everyday tasks by providing efficient, reliable services tailored to meet our customers' needs.</p>
          </Col>
          <Col>
            <h2>Our Services</h2>
            <p>✔️ Furniture Assembly</p>
            <p>✔️ Device Setup</p>
            <p>✔️ Home Repairs</p>
            <p>✔️ Cleaning</p>
            <p>✔️ Painting</p>
            <p>✔️ Moving Help</p>
          </Col>
          <Col>
            <h2>Follow Us</h2>
            <div className="social-links">
              <p><FaFacebook /> Facebook</p>
              <p><FaTwitter /> Twitter</p>
              <p><FaInstagram /> Instagram</p>
              <p><FaLinkedin /> LinkedIn</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
