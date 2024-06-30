import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import {
  createPetition,
  getPetitions,
  getAllCategories,
} from "../../api/petitions/petitionsApi";
import {
  PetitionDto,
  CreatePetitionDto,
  FilteredPetitionsDto,
  CategoryDto,
} from "../../api/petitions/petitionsModels";
import { UserDto } from "../../api/auth/models/login";
import { getUsers } from "../../api/auth/authApi";
import show from "../../utils/SnackbarUtils";
import PaginationComponent from "../../components/PaginationComponent/PaginationComponent";
import PetitionList from "../../components/PetitionList/PetitionList";
import PetitionFilters from "../../components/PetitionsFilters/PetitionsFilters";
import PetitionCreateModal from "../../components/PetitionCreateModal/PetitionCreateModal";

const PetitionsPage: React.FC = () => {
  const [petitions, setPetitions] = useState<PetitionDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isSuccessful, setIsSuccessful] = useState<boolean | undefined>(
    undefined
  );
  const [isExpired, setIsExpired] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchPetitions = useCallback(async () => {
    try {
      setLoading(true);
      const request: FilteredPetitionsDto = {
        page: currentPage,
        pageSize: 9,
        userId: selectedUserId || undefined,
        isSuccessful: isSuccessful,
        isExpired: isExpired,
        categoryId: selectedCategoryId || undefined,
        searchTerm: searchTerm || undefined,
      };
      const response = await getPetitions(request);
      setPetitions(response.items);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    selectedUserId,
    isSuccessful,
    isExpired,
    selectedCategoryId,
    searchTerm,
  ]);

  useEffect(() => {
    fetchPetitions();
  }, [fetchPetitions]);

  const fetchCategories = useCallback(async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Помилка при отриманні категорій:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Помилка при отриманні користувачів:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, [fetchCategories, fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddPetition = async (newPetition: CreatePetitionDto) => {
    try {
      await createPetition(newPetition);
      show.success("Петицію успішно створено!");
      setShowModal(false);
      await fetchPetitions();
    } catch (error) {
      console.error("Помилка при створенні петиції:", error);
    }
  };

  return (
    <Container className="petitions-container">
      <Row className="d-flex justify-content-between align-items-center mb-4">
        <Col md={3}>
          <h3>
            <i className="bi bi-card-checklist"></i> Петиції
          </h3>
        </Col>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Пошук..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleShowModal}>
            + Створити Петицію
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <PetitionFilters
            users={users}
            categories={categories}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            isSuccessful={isSuccessful}
            setIsSuccessful={setIsSuccessful}
            isExpired={isExpired}
            setIsExpired={setIsExpired}
          />
        </Col>
        <Col md={9}>
          {loading ? (
            <Row className="justify-content-center mt-4">
              <Col xs="auto">
                <Spinner animation="border" role="status"></Spinner>
              </Col>
            </Row>
          ) : (
            <>
              <PetitionList petitions={petitions} />
              {totalPages ? (
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <h3>
                    {searchTerm ||
                    selectedUserId ||
                    selectedCategoryId ||
                    isSuccessful ||
                    isExpired
                      ? "Знайдено 0 петицій"
                      : "Тут поки немає петицій"}
                  </h3>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
      <PetitionCreateModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleAddPetition={handleAddPetition}
        categories={categories}
      />
    </Container>
  );
};

export default PetitionsPage;
