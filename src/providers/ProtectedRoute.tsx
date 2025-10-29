import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/authStore';

// 1. Definimos el tipo de las props correctamente
interface ProtectedRouteProps {
  allowedRoles?: string[]; // <-- Corregido a string[] (un array de strings)
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // 2. Corregimos la sintaxis. Si no hay roles, usamos un array vacío []
  const userRoles = user?.roles || [];

  // 3. Comprobamos si se pasaron roles permitidos
  const isAuthorized = allowedRoles
    ? // Si SÍ se pasaron, comprobamos si el usuario tiene AL MENOS UNO de ellos
      allowedRoles.some((role) => userRoles.includes(role))
    : // Si NO se pasaron (allowedRoles es undefined), solo se requiere estar autenticado
      true;

  if (!isAuthorized) {
    // Si está autenticado pero no autorizado, redirigir
    return <Navigate to="/unauthorized" replace />;
  }

  // Si está autenticado y autorizado, renderizar la ruta hija
  return <Outlet />;
};
