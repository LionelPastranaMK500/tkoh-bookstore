// src/services/types/AuthState.ts
import type { User } from '@/services/types/User';
import type { ApiResponse } from '@/services/types/ApiResponse';

// Importar los nuevos tipos que creamos
import type { LoginCredentials } from './auth/LoginCredentials';
import type { LoginResponse } from './auth/LoginResponse';
import type { RegisterCredentials } from './auth/RegisterCredentials';
import type { RegisterResponse } from './auth/RegisterResponse';
import type { ForgotPasswordCredentials } from './auth/ForgotPasswordCredentials';
import type { ResetPasswordCredentials } from './auth/ResetPasswordCredentials';

export interface AuthState {
  // Estado
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;

  register: (
    credentials: RegisterCredentials,
  ) => Promise<ApiResponse<RegisterResponse>>; // Devuelve la respuesta de la API

  forgotPassword: (
    credentials: ForgotPasswordCredentials,
  ) => Promise<ApiResponse<void>>; // Devuelve la respuesta de la API

  resetPassword: (
    credentials: ResetPasswordCredentials,
  ) => Promise<ApiResponse<void>>; // Devuelve la respuesta de la API

  logout: () => void;
  setAccessToken: (token: string) => void;
  fetchUser: () => Promise<void>;
}
