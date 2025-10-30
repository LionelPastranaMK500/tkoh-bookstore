// src/features/auth/interface/RoleDto.ts
export interface RoleDto {
  id: number; // En Java es Long, en TS es number
  nombreRol: string;
  descripcion?: string | null; // Hacer opcional o nullable
}
