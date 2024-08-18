import React, { useEffect, useState } from "react";
import { Container, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const message = state?.msg;

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedInName, setIsLoggedInName] = useState("");

  useEffect(() => {
    const logddin = JSON.parse(localStorage.getItem("loggdin"));
    if (logddin) {
      setIsLoggedIn(true);
      setIsLoggedInName(logddin.name);
    }
  }, []);

  return (
    <div className="welcome-page">
      <Container className="text-center">
        <Row className="justify-content-center align-items-center">
          <Col md={8}>
            {isLoggedIn ? (
              <>
                <h1 className="display-4 welcome-title">
                  Welcome, {isLoggedInName}!
                </h1>
                <p className="lead">You are successfully logged in.</p>
              </>
            ) : (
              <>
                <h1 className="display-4 welcome-title">
                  Welcome to React Chat App
                </h1>
                {message && (
                  <Alert variant="info" className="mt-3">
                    {message}
                  </Alert>
                )}
                <div className="mt-5">
                  <h4>Existing Users</h4>
                  <Button
                    variant="primary"
                    onClick={handleLoginClick}
                    className="mx-2 my-2"
                  >
                    Login
                  </Button>
                </div>
                <div className="mt-4">
                  <h4>New Users</h4>
                  <Button
                    variant="secondary"
                    onClick={handleRegisterClick}
                    className="mx-2 my-2"
                  >
                    Register
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Welcome;
