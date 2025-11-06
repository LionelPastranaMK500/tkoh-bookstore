// src/services/types/simple/LogActividadDto.ts
// Basado en LogActividadDto.java

export interface LogActividadDto {
  id: number;
  fecha: string; // Instant
  accionRealizada: string;
  detalles: string;
  usuarioId: number;
  usuarioNombre: string;
}
