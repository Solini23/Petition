import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPetitionById,
  updatePetition,
  deletePetition,
  getAllCategories,
  signPetition,
} from "../../api/petitions/petitionsApi";
import {
  PetitionDto,
  UpdatePetitionDto,
  CategoryDto,
} from "../../api/petitions/petitionsModels";
import show from "../../utils/SnackbarUtils";
import {
  Button,
  Card,
  Spinner,
  Container,
  Row,
  Col,
  Form,
  ListGroup,
} from "react-bootstrap";
import { useAppSelector } from "../../redux/hooks";
import { formatDateToLocaleDateTime } from "../../common/dateTimeUtils";
import PaginationComponent from "../../components/PaginationComponent/PaginationComponent";

const PetitionEditPage: React.FC = () => {
  const { petitionId } = useParams<{ petitionId: string }>();
  const [petition, setPetition] = useState<PetitionDto | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [petitionTitle, setPetitionTitle] = useState<string>("");
  const [petitionDescription, setPetitionDescription] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [signaturesPerPage] = useState<number>(10); // Number of signatures per page
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isOwner = user?.id === petition?.createdByUser.id;

  useEffect(() => {
    const fetchPetition = async () => {
      try {
        if (!petitionId) {
          show.error("ID петиції обов'язкове");
          return;
        }
        const fetchedPetition = await getPetitionById(petitionId);
        setPetition(fetchedPetition);
        setPetitionTitle(fetchedPetition.title);
        setPetitionDescription(fetchedPetition.description);
        setSelectedCategoryId(fetchedPetition.category.id);
      } catch (error) {
        console.error("Помилка при отриманні петиції:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Помилка при отриманні категорій:", error);
      }
    };

    fetchPetition();
    fetchCategories();
  }, [petitionId]);

  const handleSavePetition = async () => {
    if (!petition) return;
    try {
      const updatedPetition: UpdatePetitionDto = {
        id: petition.id,
        title: petitionTitle,
        description: petitionDescription,
        requiredSignatures: petition.requiredSignatures,
        expirationDate: petition.expirationDate,
        categoryId: selectedCategoryId,
      };
      const response = await updatePetition(updatedPetition);
      setPetition(response);
      show.success("Петицію успішно оновлено");
      navigate("/petitions");
    } catch (error) {
      console.error("Помилка при збереженні петиції:", error);
      show.error("Помилка при збереженні петиції");
    }
  };

  const handleDeletePetition = async () => {
    if (!petition) return;
    try {
      await deletePetition(petition.id);
      show.success("Петицію успішно видалено");
      navigate("/petitions");
    } catch (error) {
      console.error("Помилка при видаленні петиції:", error);
      show.error("Помилка при видаленні петиції");
    }
  };

  const handleSignPetition = async () => {
    if (!petition) return;
    try {
      await signPetition(petition.id);
      show.success("Петицію успішно підписано");
      const updatedPetition = await getPetitionById(petition.id);
      setPetition(updatedPetition);
    } catch (error) {
      console.error("Помилка при підписанні петиції:", error);
      show.error("Помилка при підписанні петиції");
    }
  };

  const handleCopyLink = () => {
    const petitionLink = window.location.href;
    navigator.clipboard
      .writeText(petitionLink)
      .then(() => {
        show.success("Посилання скопійовано в буфер обміну");
      })
      .catch((error) => {
        console.error("Помилка при копіюванні посилання:", error);
        show.error("Не вдалося скопіювати посилання");
      });
  };

  const userHasSigned = petition?.signatures.some(
    (signature) => signature.signedByUser.id === user?.id
  );

  const isPetitionExpired =
    petition?.expirationDate && new Date(petition?.expirationDate) < new Date();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastSignature = currentPage * signaturesPerPage;
  const indexOfFirstSignature = indexOfLastSignature - signaturesPerPage;
  const currentSignatures =
    petition?.signatures.slice(indexOfFirstSignature, indexOfLastSignature) ||
    [];
  const totalPages = Math.ceil(
    (petition?.signatures.length || 0) / signaturesPerPage
  );

  return (
    <Container>
      {petition ? (
        <Row className="mt-4">
          <Col md={6}>
            <Card>
              <Card.Header style={{ borderBottom: "none" }}>
                <Form.Group controlId="petitionTitle">
                  <Form.Label>Заголовок</Form.Label>
                  <Form.Control
                    type="text"
                    value={petitionTitle}
                    onChange={(e) => setPetitionTitle(e.target.value)}
                    disabled={!isOwner}
                  />
                </Form.Group>
                <Form.Group controlId="petitionDescription" className="mt-3">
                  <Form.Label>Опис</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={petitionDescription}
                    onChange={(e) => setPetitionDescription(e.target.value)}
                    disabled={!isOwner}
                  />
                </Form.Group>
                <Form.Group controlId="petitionCategory" className="mt-3">
                  <Form.Label>Категорія</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    disabled={!isOwner}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {isOwner && (
                  <>
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={handleSavePetition}
                    >
                      Оновити
                    </Button>
                    <Button
                      variant="danger"
                      className="mt-3 ms-2"
                      onClick={handleDeletePetition}
                    >
                      Видалити
                    </Button>
                  </>
                )}
              </Card.Header>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <div className="mb-2">
                  <span className="me-2">
                    <i className="bi bi-check-circle-fill text-success"></i>{" "}
                    Підписано: {petition.signatures.length}
                  </span>
                  {petition.requiredSignatures - petition.signatures.length >
                    0 && (
                    <span>
                      <i className="bi bi-x-circle-fill text-danger"></i>{" "}
                      Залишилось підписів:{" "}
                      {petition.requiredSignatures - petition.signatures.length}
                    </span>
                  )}
                </div>
                <ListGroup className="mb-3">
                  {currentSignatures.map((signature) => (
                    <ListGroup.Item key={signature.id}>
                      {signature.signedByUser.email} (підписано:{" "}
                      {formatDateToLocaleDateTime(signature.createdAt)})
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                {totalPages > 1 && (
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                )}

                {!userHasSigned && !isPetitionExpired && (
                  <Button
                    variant="success"
                    className="mt-3 me-3"
                    onClick={handleSignPetition}
                  >
                    Підписати Петицію
                  </Button>
                )}
                <Button
                  variant="info"
                  className="mt-3"
                  onClick={handleCopyLink}
                >
                  <i className="bi bi-clipboard"></i> Поширити петицію
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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

export default PetitionEditPage;
