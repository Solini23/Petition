import api from "../api";
import { PagedResultDto } from "../pagedResultDto";
import {
  CreatePetitionDto,
  FilteredPetitionsDto,
  PetitionDto,
  PetitionStatisticsDto,
  UpdatePetitionDto,
  CategoryDto,
} from "./petitionsModels";

const PETITIONS = "petition";

export async function createPetition(
  request: CreatePetitionDto
): Promise<{ petitionId: string }> {
  const response = await api.post<{ petitionId: string }>(
    `${PETITIONS}/create`,
    request
  );
  return response.data;
}

export async function getStatistics(): Promise<PetitionStatisticsDto> {
  const response = await api.get<PetitionStatisticsDto>(
    `${PETITIONS}/statistics`
  );
  return response.data;
}

export async function getCategories(): Promise<CategoryDto[]> {
  const response = await api.get<CategoryDto[]>(`${PETITIONS}/all-categories`);
  return response.data;
}

export async function getPetitions(
  request: FilteredPetitionsDto
): Promise<PagedResultDto<PetitionDto>> {
  const response = await api.get<PagedResultDto<PetitionDto>>(
    `${PETITIONS}/all-petitions`,
    {
      params: request,
    }
  );
  return response.data;
}

export async function getPetitionById(
  petitionId: string
): Promise<PetitionDto> {
  const response = await api.get<PetitionDto>(`${PETITIONS}/${petitionId}`);
  return response.data;
}

export async function updatePetition(
  petition: UpdatePetitionDto
): Promise<PetitionDto> {
  const response = await api.put(`${PETITIONS}/update`, petition);
  return response.data;
}

export async function deletePetition(petitionId: string): Promise<void> {
  await api.delete(`${PETITIONS}/delete/${petitionId}`);
}

export async function getAllCategories(): Promise<CategoryDto[]> {
  const response = await api.get<CategoryDto[]>(`${PETITIONS}/all-categories`);
  return response.data;
}

export async function signPetition(petitionId: string): Promise<void> {
  await api.post(`${PETITIONS}/sign/${petitionId}`);
}