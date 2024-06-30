import { UserDto } from "../auth/models/login";
import { PagedRequestDto } from "../pagedResultDto";

export interface PetitionDto {
  id: string;
  title: string;
  description: string;
  requiredSignatures: number;
  expirationDate: string;
  category: CategoryDto;
  createdByUser: UserDto;
  signatures: SignatureDto[];
}

export interface SignatureDto {
  id: string;
  createdAt: string;
  petition: PetitionDto;
  signedByUser: UserDto;
}

export interface CategoryDto {
  id: string;
  name: string;
}

export interface FilteredPetitionsDto extends PagedRequestDto {
  userId?: string;
  isSuccessful?: boolean;
  isExpired?: boolean;
  categoryId?: string;
  searchTerm?: string;
}

export interface PetitionStatisticsDto {
  totalPetitions: number;
  totalSignatures: number;
  successfulPetitions: number;
  failedPetitions: number;
  createdPetitionsByDay: { [date: string]: number };
  signedPetitionsByDay: { [date: string]: number };
  expiredPetitionsByDay: { [date: string]: number };
}

export interface CreatePetitionDto {
  title: string;
  description: string;
  categoryId: string;
}

export interface UpdatePetitionDto {
  id: string;
  title: string;
  description: string;
  requiredSignatures: number;
  expirationDate: string;
  categoryId: string;
}
