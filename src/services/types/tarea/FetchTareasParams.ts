// src/services/types/tarea/FetchTareasParams.ts

export interface FetchTareasParams {
  page: number;
  size: number;
  scope: 'all' | 'me';
  completado?: boolean;
}
