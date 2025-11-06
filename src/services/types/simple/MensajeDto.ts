// src/services/types/simple/MensajeDto.ts
// Basado en MensajeDto.java
export interface MensajeDto {
  id: number;
  conversacionId: number;
  cuerpoMensaje: string;
  fechaEnvio: string;
  usuarioEmisorId: number;
  usuarioEmisorNombre: string;
}
