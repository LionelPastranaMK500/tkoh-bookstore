// src/services/types/api.ts
// Esta es una buena ubicación para los tipos que definen la "forma" de la API.

/**
 * Define la envoltura de respuesta estándar de la API.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string; // O Date si lo parseas
}

/**
 * Define la estructura de paginación de la API.
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
