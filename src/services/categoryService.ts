import { apiFetch } from "@/lib/api";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "@/types/category";

export const categoryService = {
  getAll: () => apiFetch<Category[]>("/api/categories"),
  getById: (id: number) => apiFetch<Category>(`/api/categories/${id}`),
  create: (dto: CreateCategoryDto) => apiFetch<Category>("/api/categories", { method: "POST", body: JSON.stringify(dto) }),
  update: (id: number, dto: UpdateCategoryDto) => apiFetch<void>(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(dto) }),
  delete: (id: number) => apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" }),
};
