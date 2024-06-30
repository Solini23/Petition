import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CategoryDto, CreatePetitionDto } from "../../api/petitions/petitionsModels";

interface PetitionCreateModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  handleAddPetition: (newPetition: CreatePetitionDto) => void;
  categories: CategoryDto[];
}

const PetitionCreateModal: React.FC<PetitionCreateModalProps> = ({
  showModal,
  handleCloseModal,
  handleAddPetition,
  categories,
}) => {
  const [newPetitionTitle, setNewPetitionTitle] = useState("");
  const [newPetitionDescription, setNewPetitionDescription] = useState("");
  const [newPetitionCategoryId, setNewPetitionCategoryId] = useState("");

  const handleCreate = () => {
    handleAddPetition({
      title: newPetitionTitle,
      description: newPetitionDescription,
      categoryId: newPetitionCategoryId,
    });
    setNewPetitionTitle("");
    setNewPetitionDescription("");
    setNewPetitionCategoryId("");
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Створення Нової Петиції</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPetitionTitle">
            <Form.Label>Заголовок</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введіть заголовок петиції"
              value={newPetitionTitle}
              onChange={(e) => setNewPetitionTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPetitionDescription" className="mt-3">
            <Form.Label>Опис</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              rows={5}
              placeholder="Введіть опис петиції"
              value={newPetitionDescription}
              onChange={(e) => setNewPetitionDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPetitionCategoryId" className="mt-3">
            <Form.Label>Категорія</Form.Label>
            <Form.Control
              as="select"
              value={newPetitionCategoryId}
              onChange={(e) => setNewPetitionCategoryId(e.target.value)}
            >
              <option value="">Виберіть категорію</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Відмінити
        </Button>
        <Button
          variant="primary"
          onClick={handleCreate}
          disabled={
            !newPetitionTitle ||
            !newPetitionDescription ||
            !newPetitionCategoryId
          }
        >
          Створити
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PetitionCreateModal;
