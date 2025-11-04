// src/services/types/simple/RoleDto.ts
/**
 * Define la estructura de un Rol (RoleDto).
 * (Basado en RoleDto.java)
 */
export interface RoleDto {
  id: number;
  nombreRol: string;
  descripcion?: string | null;
}
