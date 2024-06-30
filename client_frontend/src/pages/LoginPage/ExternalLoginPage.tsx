import { useNavigate, useParams } from "react-router";
import show from "../../utils/SnackbarUtils";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useEffect } from "react";
import { setAuth } from "../../redux/slices/authSlice";
import { me } from "../../api/auth/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { setAccessToken } from "../../common/localStorage";

export const ExternalLoginPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleGoHome = () => {
      navigate("/");
    };

    const fetchData = async () => {
      try {
        if (!token) {
          show.error("Помилка авторизації через сторонній сервіс");
          return (
            <Container className="text-center mt-5">
              <Row className="justify-content-center">
                <Col md={6}>
                  <h1>Помилка авторизації через сторонній сервіс</h1>
                  <p>
                    Наша команда вже вивчає помилку, перепрошуємо за
                    незручності.
                  </p>
                  <Button variant="primary" onClick={handleGoHome}>
                    Повернутися на головну сторінку
                  </Button>
                </Col>
              </Row>
            </Container>
          );
        }

        setAccessToken(token);
        const response = await me();
        dispatch(setAuth({ token: response.token, user: response.user }));
        navigate("/");
      } catch (error) {
        show.error("Помилка отримання даних користувача");
        navigate("/");
      }
    };

    fetchData();
  }, [token, navigate, dispatch]);

  return null;
};
