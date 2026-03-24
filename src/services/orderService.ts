import { apiFetch } from "@/lib/api";
import type { CreateOrderDto, Order } from "@/types/order";

export const orderService = {
  create: (dto: CreateOrderDto) => apiFetch<Order>("/api/orders", { method: "POST", body: JSON.stringify(dto) }),
  getMyOrders: () => apiFetch<Order[]>("/api/orders/mine"),
  getAllAdmin: () => apiFetch<Order[]>("/api/orders/admin"),
  getById: (id: number) => apiFetch<Order>(`/api/orders/${id}`),
};
