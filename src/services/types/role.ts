// src/modules/admin/types/role.ts
// ¡Como sugeriste! El tipo RoleDto vive dentro del módulo que lo usa.

/**
 * Define la estructura de un Rol (RoleDto).
 */
export interface RoleDto {
  id: number;
  nombreRol: string;
  descripcion?: string | null;
}
