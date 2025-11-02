// src/services/types/auth.ts

/**
 * Define la respuesta del endpoint de Login.
 */
export interface LoginResponse {
  token: string;
  tokenType?: string;
}

/**
 * Define las props para el componente ProtectedRoute.
 */
export interface ProtectedRouteProps {
  allowedRoles?: string[];
}
