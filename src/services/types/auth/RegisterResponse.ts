// src/services/types/auth/RegisterResponse.ts
import type { UsuarioDto } from '../simple/UsuarioDto';

/**
 * Respuesta del endpoint de Registro.
 * (Basado en RegisterResponse.java)
 */
export interface RegisterResponse {
  message: string;
  usuario: UsuarioDto;
}
