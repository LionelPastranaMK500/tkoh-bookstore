// scr/features/auth/interface/User.ts
import type { RoleDto } from '@/features/auth/interface/RoleDto';
// Define la interfaz para el Usuario, basada en UsuarioDetailDto.java
export interface User {
  id: number; // En Java es Long, en TS es number
  nombreUsuario: string;
  email: string;
  celular?: string | null; // Hacer opcional o nullable
  fechaRegistro: string; // En Java es Instant, en TS podemos usar string o Date
  enabled: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean; // No está en UsuarioDetailDto, pero sí en Usuario.java
  credentialsNonExpired: boolean; // No está en UsuarioDetailDto, pero sí en Usuario.java
  roles: RoleDto[]; // Un array de roles
  // Añadir 'permissions' si planeas guardarlos también en el estado
  // permissions?: string[];
}
