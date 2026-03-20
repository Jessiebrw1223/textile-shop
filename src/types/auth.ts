export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface UserListItem extends UserProfile {
  isActive: boolean;
  createdAt: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface QuoteRequestDto {
  companyName: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  productRequired: string;
  estimatedQuantity: string;
  message: string;
}
