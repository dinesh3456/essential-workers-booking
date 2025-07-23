// User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "client" | "worker" | "admin";
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role?: "client" | "worker";
}

// Auth response
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password reset
export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

// Change password
export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
