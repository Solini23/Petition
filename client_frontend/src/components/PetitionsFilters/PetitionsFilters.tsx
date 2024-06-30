import React from "react";
import { Form, Card, Button } from "react-bootstrap";
import { CategoryDto } from "../../api/petitions/petitionsModels";
import { UserDto } from "../../api/auth/models/login";
import { FaFilter } from "react-icons/fa";

interface PetitionFiltersProps {
  users: UserDto[];
  categories: CategoryDto[];
  selectedUserId: string;
  setSelectedUserId: (value: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (value: string) => void;
  isSuccessful: boolean | undefined;
  setIsSuccessful: (value: boolean | undefined) => void;
  isExpired: boolean | undefined;
  setIsExpired: (value: boolean | undefined) => void;
}

const PetitionFilters: React.FC<PetitionFiltersProps> = ({
  users,
  categories,
  selectedUserId,
  setSelectedUserId,
  selectedCategoryId,
  setSelectedCategoryId,
  isSuccessful,
  setIsSuccessful,
  isExpired,
  setIsExpired,
}) => {
  const clearFilters = () => {
    setSelectedUserId("");
    setSelectedCategoryId("");
    setIsSuccessful(undefined);
    setIsExpired(undefined);
  };

  return (
    <Card className="p-3 mb-4 shadow-sm">
      <Card.Body>
        <Form.Group controlId="formUserFilter">
          <Form.Label className="pb-2">
            <FaFilter /> Фільтрація Петицій
          </Form.Label>
          <Form.Control
            as="select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Усі користувачі</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formCategoryFilter" className="mt-3">
          <Form.Control
            as="select"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">Усі категорії</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formSuccessfulFilter" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Успішні"
            checked={isSuccessful || false}
            onChange={(e) =>
              setIsSuccessful(e.target.checked ? true : undefined)
            }
          />
        </Form.Group>
        <Form.Group controlId="formExpiredFilter" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Прострочені"
            checked={isExpired || false}
            onChange={(e) => setIsExpired(e.target.checked ? true : undefined)}
          />
        </Form.Group>
        <Button variant="secondary" className="mt-3" onClick={clearFilters}>
          Очистити Фільтри
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PetitionFilters;
