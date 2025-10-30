// src/providers/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/authStore';
import type { RoleDto } from '@/features/auth/interface/RoleDto'; // Importar RoleDto
import type { ProtectedRouteProps } from '@/features/auth/interface/Auxiliar';

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Obtenemos los roles del usuario. Si no hay, es un array vacío.
  // user.roles es RoleDto[] | undefined
  const userRoles: RoleDto[] = user?.roles || [];

  // Comprobamos si se especificaron roles permitidos para esta ruta.
  const isAuthorized = allowedRoles
    ? // Si SÍ se pasaron roles permitidos:
      // Verificamos si AL MENOS UNO de los roles permitidos (allowedRoles - strings)
      // coincide con el nombreRol de AL MENOS UNO de los roles que tiene el usuario (userRoles - objetos).
      allowedRoles.some(
        (
          allowedRoleName, // Para cada nombre de rol permitido...
        ) =>
          userRoles.some((userRole) => userRole.nombreRol === allowedRoleName), // ...verificamos si el usuario tiene un rol con ese nombre.
      )
    : // Si NO se pasaron allowedRoles, significa que solo se requiere estar autenticado.
      true;

  if (!isAuthorized) {
    // Si está autenticado pero su rol no está en allowedRoles, redirigir a "no autorizado".
    return <Navigate to="/unauthorized" replace />;
  }

  // Si está autenticado Y autorizado (ya sea porque no se requerían roles específicos o porque tiene uno de los permitidos),
  // renderiza el contenido de la ruta anidada.
  return <Outlet />;
};
