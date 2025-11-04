// src/services/types/update/UsuarioUpdateDto.ts
/**
 * DTO para actualizar un usuario desde el panel de admin.
 * Coincide con UsuarioUpdateDto.java
 */
export interface UsuarioUpdateDto {
  id: number;
  nombreUsuario: string;
  celular?: string;
  enabled?: boolean;
  accountNonLocked?: boolean;
  roleIds?: Set<number>;
}
