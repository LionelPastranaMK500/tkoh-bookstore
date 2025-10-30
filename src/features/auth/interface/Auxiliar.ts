// src/features/auth/interface/Auxiliar.ts
// Definición auxiliar para la estructura de respuesta genérica de tu API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string; // O Date si lo parseas
}

export interface ProtectedRouteProps {
  allowedRoles?: string[]; // Array de nombres de roles permitidos (strings)
}
