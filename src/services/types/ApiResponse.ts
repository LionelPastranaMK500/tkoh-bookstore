// src/services/types/ApiResponse.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string; // O Date si lo parseas
}
