// scr/features/auth/interface/User.ts
import type { RoleDto } from '@/services/types/role';
/**
 * Define la estructura del Usuario (UsuarioDetailDto).
 */
export interface User {
  id: number;
  nombreUsuario: string;
  email: string;
  celular?: string | null;
  fechaRegistro: string;
  enabled: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  roles: RoleDto[];
}
