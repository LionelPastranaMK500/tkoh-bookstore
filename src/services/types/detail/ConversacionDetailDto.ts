// src/services/types/detail/ConversacionDetailDto.ts
// Basado en ConversacionDetailDto.java
import type { MensajeDto } from '../simple/MensajeDto';
import type { UsuarioDto } from '../simple/UsuarioDto';

export interface ConversacionDetailDto {
  id: number;
  asunto: string;
  fechaCreacion: string; // Instant
  participantes: UsuarioDto[];
  mensajes: MensajeDto[];
}
