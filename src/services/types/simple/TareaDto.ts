// src/services/types/simple/TareaDto.ts
// Basado en TareaDto.java

export interface TareaDto {
  id: number;
  descripcion: string;
  completado: boolean;
  fechaCreacion: string; // Instant
  fechaLimite: string; // Instant
  usuarioAsignadoId: number;
  usuarioAsignadoNombre: string;
}
