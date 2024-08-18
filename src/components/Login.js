import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const message = state?.msg;
  const loggdin = JSON.parse(localStorage.getItem("loggdin"));

  if (loggdin) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is invalid";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    }

    let users = JSON.parse(localStorage.getItem("users"));

    if (!Array.isArray(users)) {
      users = [];
      // Optional: Save the empty array back to localStorage if you want to initialize it
      localStorage.setItem("users", JSON.stringify(users));
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      localStorage.setItem("loggdin", JSON.stringify(user));
      navigate("/welcome");
      handleLogin(true);
    } else {
      setErrors({ general: "Invalid email or password" });
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-md-center">
          <Col md="6">
            <Card className="shadow-lg p-4 mt-5">
              <Card.Body>
                <h2 className="text-center mb-4">Login</h2>
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {errors.general && (
                    <Alert variant="danger" className="text-center">
                      {errors.general}
                    </Alert>
                  )}

                  <div className="d-flex justify-content-between">
                    <Button variant="primary" type="submit" className="px-4">
                      Login
                    </Button>
                    <Button
                      variant="success"
                      type="button"
                      onClick={() => navigate("/register")}
                      className="px-4"
                    >
                      Register
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
