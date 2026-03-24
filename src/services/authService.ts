import { apiFetch } from "@/lib/api";
import type { AuthResponse, ForgotPasswordDto, LoginDto, QuoteRequestDto, RegisterDto, ResetPasswordDto, UserListItem, UserProfile } from "@/types/auth";

export const authService = {
  register: (dto: RegisterDto) => apiFetch<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(dto) }),
  login: (dto: LoginDto) => apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(dto) }),
  forgotPassword: (dto: ForgotPasswordDto) => apiFetch<{ message: string }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify(dto) }),
  resetPassword: (dto: ResetPasswordDto) => apiFetch<{ message: string }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify(dto) }),
  sendQuoteRequest: (dto: QuoteRequestDto) => apiFetch<{ message: string }>("/api/auth/quote-request", { method: "POST", body: JSON.stringify(dto) }),
  getProfile: () => apiFetch<UserProfile>("/api/users/me"),
  getAll: () => apiFetch<UserListItem[]>("/api/users"),
};
