// src/features/auth/interface/AuthState.ts
import type { User } from '@/services/types/User';
export interface AuthState {
  user: User | null; // Cambiado de any o tipo simple a User
  accessToken: string | null;
  // refreshToken: string | null; // Tu API no parece devolver Refresh Token en /login
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  setAccessToken: (token: string) => void; // Mantenemos por si el interceptor lo necesita
  fetchUser: () => Promise<void>; // Nueva acción para obtener datos del usuario
}
