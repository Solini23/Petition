import React from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../../api/auth/authApi";
import { RegisterRequest } from "../../api/auth/models/register";
import { useNavigate } from "react-router";
import show from "./../../utils/SnackbarUtils";
import { setAuth } from "../../redux/slices/authSlice";
import { useAppDispatch } from "../../redux/hooks";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { BackendUrl } from "../../api/constants";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: Yup.object({
      login: Yup.string().email("Введіть коректний email").required("Логін є обов'язковим"),
      password: Yup.string()
        .min(8, "Пароль має містити принаймні 8 символів")
        .matches(/[a-z]/, "Пароль має містити хоча б одну малу літеру")
        .matches(/[A-Z]/, "Пароль має містити хоча б одну велику літеру")
        .matches(/\d/, "Пароль має містити хоча б одну цифру")
        .matches(
          /[#$^+=!*()@%&]/,
          "Пароль має містити хоча б один спеціальний символ"
        )
        .required("Пароль є обов'язковим"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const model: RegisterRequest = {
          email: values.login,
          password: values.password,
        };
        const response = await register(model);
        dispatch(setAuth({ token: response.token, user: response.user }));
        show.success("Акаунт успішно створено");
        navigate("/");
      } catch (error) {
        console.error(error);
        // show.error("Виникли помилки під час реєстрації");
      } finally {
        setSubmitting(false);
      }
    },
  });

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
          <h1>Реєстрація</h1>
          <Form onSubmit={formik.handleSubmit} className="mt-3">
            <Form.Group controlId="login">
              <Form.Label>Логін</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введіть ваш логін"
                {...formik.getFieldProps("login")}
                isInvalid={!!formik.errors.login && formik.touched.login}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.login}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Введіть ваш пароль"
                {...formik.getFieldProps("password")}
                isInvalid={!!formik.errors.password && formik.touched.password}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="col-12 mt-3"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Зареєструватись"
              )}
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

export default RegisterPage;
