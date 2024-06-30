import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getStatistics } from "../../api/petitions/petitionsApi";
import { PetitionStatisticsDto } from "../../api/petitions/petitionsModels";
import show from "../../utils/SnackbarUtils";
import { formatDateToLocaleDate } from "../../common/dateTimeUtils";

const PetitionsAnalytics: React.FC = () => {
  const [statistics, setStatistics] = useState<PetitionStatisticsDto | null>(
    null
  );

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const fetchedStatistics = await getStatistics();
        setStatistics(fetchedStatistics);
      } catch (error) {
        console.error("Помилка при отриманні статистики:", error);
        show.error("Помилка при отриманні статистики");
      }
    };

    fetchStatistics();
  }, []);

  const transformData = (data: { [date: string]: number }) => {
    return Object.keys(data).map((date) => ({
      date: formatDateToLocaleDate(date),
      count: data[date],
    }));
  };

  return (
    <Container>
      {statistics ? (
        <>
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header>Загальна Статистика</Card.Header>
                <Card.Body>
                  <p>Всього петицій: {statistics.totalPetitions}</p>
                  <p>Всього підписів: {statistics.totalSignatures}</p>
                  <p>Успішні петиції: {statistics.successfulPetitions}</p>
                  <p>Неуспішні петиції: {statistics.failedPetitions}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Header>Кількість створених петицій по днях</Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={transformData(statistics.createdPetitionsByDay)}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Кількість"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>Кількість підписаних петицій по днях</Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={transformData(statistics.signedPetitionsByDay)}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Кількість"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Header>
                  Кількість прострочених петицій по днях
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={transformData(statistics.expiredPetitionsByDay)}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Кількість"
                        stroke="#ff7300"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Row className="justify-content-center mt-4">
          <Col xs="auto">
            <Spinner animation="border" role="status"></Spinner>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PetitionsAnalytics;
