import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggdin = JSON.parse(localStorage.getItem("loggdin"));
    if (loggdin) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z ]*$/;

    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required";
    } else if (!nameRegex.test(formData.fullName)) {
      errors.fullName = "Name is invalid";
    }

    let getUsers = JSON.parse(localStorage.getItem("users"));
    if (!Array.isArray(getUsers)) {
      getUsers = [];
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Email is invalid";
    } else if (getUsers.find((user) => user.email === formData.email)) {
      errors.email = "User already exists";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSubmitted(true);

      const uniqueId = Date.now();
      let users = JSON.parse(localStorage.getItem("users"));
      const newUser = {
        id: uniqueId,
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      };
      if (!Array.isArray(users)) {
        users = [];
      }
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      navigate("/login", {
        state: {
          from: window.location.pathname,
          msg: "Registration successful! Please login Here.",
        },
      });
    }
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-md-center">
          <Col md="6">
            <Card className="shadow-lg p-4 mt-5">
              <Card.Body>
                <h2 className="text-center mb-4">Register</h2>
                {submitted && (
                  <Alert variant="success">Registration successful!</Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formFullName" className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      isInvalid={!!errors.fullName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
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
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formConfirmPassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-between">
                    <Button variant="primary" type="submit" className="px-4">
                      Register
                    </Button>
                    <Button
                      variant="success"
                      type="Button"
                      onClick={() => navigate("/login")}
                      className="px-4"
                    >
                      Login
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

export default Register;
