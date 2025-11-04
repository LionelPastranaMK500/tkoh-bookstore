// src/services/types/simple/UsuarioDto.ts
/**
 * DTO simple para la tabla de usuarios.
 * Coincide con UsuarioDto.java
 */
export interface UsuarioDto {
  id: number;
  nombreUsuario: string;
  email: string;
  enabled: boolean;
  fechaRegistro: string; // La API devuelve Instant, que es un string en JSON
}
