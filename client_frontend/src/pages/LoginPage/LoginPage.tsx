import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { login } from "../../api/auth/authApi";
import { useNavigate } from "react-router-dom";
import show from "./../../utils/SnackbarUtils";
import { LoginRequest } from "../../api/auth/models/login";
import { setAuth } from "../../redux/slices/authSlice";
import { useAppDispatch } from "../../redux/hooks";
import { BackendUrl } from "../../api/constants";
import { FaFacebook, FaGoogle } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const model: LoginRequest = {
        email,
        password,
      };
      const response = await login(model);
      dispatch(setAuth({ token: response.token, user: response.user }));

      navigate("/");
    } catch (error) {
      show.error("Некоректний логін або пароль");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${BackendUrl}/oauth/login`;
  };

  const handleFacebookLogin = async () => {
    window.location.href = `${BackendUrl}/facebook/login`;
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={4}>
          <h1>Вхід у систему</h1>
          <Form
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
            className="mt-3"
          >
            <Form.Group controlId="email">
              <Form.Label>Логін</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введіть ваш логін"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Введіть ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className={`col-12 mt-3 ${isLoading ? "disabled" : ""}`}
            >
              {isLoading ? <Spinner animation="border" size="sm" /> : "Вхід"}
            </Button>
            <Button
              variant="outline-primary"
              className="col-12 mt-3 d-flex align-items-center justify-content-center"
              onClick={handleGoogleLogin}
              style={{ position: "relative" }}
            >
              <FaGoogle style={{ position: "absolute", left: "15px" }} />
              Увійти через Google
            </Button>
            <Button
              variant="outline-primary"
              className="col-12 mt-3 d-flex align-items-center justify-content-center"
              onClick={handleFacebookLogin}
              style={{ position: "relative" }}
            >
              <FaFacebook style={{ position: "absolute", left: "15px" }} />
              Увійти через Facebook
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
