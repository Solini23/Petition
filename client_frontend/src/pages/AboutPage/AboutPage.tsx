import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutPage: React.FC = () => {
  return (
    <Container>
      <h1 className="my-4">Про Нас</h1>
      <Row>
        <Col md={8}>
          <p>
            Ласкаво просимо на наш сайт управління петиціями! Ця платформа
            дозволяє ефективно створювати та керувати петиціями, організовуючи
            їх у категорії. Незалежно від того, чи керуєте ви особистими
            кампаніями, громадськими ініціативами чи будь-якими іншими типами
            петицій, наш сайт пропонує інструменти, необхідні для підтримання
            організованості та ефективності.
          </p>
          <h2>Особливості</h2>
          <ul>
            <li>Створення та управління петиціями</li>
            <li>Групування петицій у налаштовані категорії</li>
            <li>Відстеження прогресу та підписів петицій</li>
          </ul>
          <h2>Наша Місія</h2>
          <p>
            Наша місія полягає в тому, щоб надати простий, але потужний
            інструмент управління петиціями, який допомагає окремим особам та
            громадам висловлювати свої ідеї. Ми віримо, що за допомогою
            правильних інструментів кожен може досягти своїх цілей та зробити
            свій голос почутим.
          </p>
          <h2>Зв'яжіться з Нами</h2>
          <p>
            Якщо у вас є якісь питання або відгуки, не соромтеся звертатися до
            нас за адресою{" "}
            <a href="mailto:support@petitionmanagement.com">
              support@petitionmanagement.com
            </a>
            . Ми завжди раді допомогти!
          </p>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img
              variant="top"
              src="about.webp"
              alt="Управління Петиціями"
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
