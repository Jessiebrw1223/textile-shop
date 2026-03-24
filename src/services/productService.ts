import { apiFetch } from "@/lib/api";
import type { CreateProductDto, Product, UpdateProductDto } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products");
}

export async function getProductById(id: number): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`);
}

export const productService = {
  getAll: getProducts,
  getById: getProductById,
  create: (dto: CreateProductDto) =>
    apiFetch<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  update: (id: number, dto: UpdateProductDto) =>
    apiFetch<void>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),
  delete: (id: number) =>
    apiFetch<void>(`/api/products/${id}`, {
      method: "DELETE",
    }),
};
