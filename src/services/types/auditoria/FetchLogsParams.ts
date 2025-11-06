// src/services/types/auditoria/FetchLogsParams.ts

export interface FetchLogsParams {
  page: number;
  size: number;
  nombreUsuario?: string;
  accion?: string;
}
