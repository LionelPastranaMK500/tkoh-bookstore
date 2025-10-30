// src/providers/router.tsx
import { Route, Routes, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
// import { UserProfilePage } from '@/pages/UserProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';

// Importar las páginas específicas de roles
import { OwnerPage } from '@/pages/roles/OwnerPage';
import { AdminPage } from '@/pages/roles/AdminPage';
import { VendedorPage } from '@/pages/roles/VendedorPage';
import { UsuarioPage } from '@/pages/roles/UsuarioPage'; // *** DESCOMENTADO ***

// Importar dependencias
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '@/features/auth/model/authStore';
import { getRedirectPathForUser } from '@/utils/roleUtils'; // Asegúrate que la ruta sea correcta (quizás '@/utils/roleUtils')

export const AppRouter = () => {
  const { isAuthenticated, user } = useAuthStore();

  const mainUserPath = isAuthenticated
    ? getRedirectPathForUser(user)
    : '/login';

  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={mainUserPath} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* --- Rutas Protegidas (Requieren al menos estar autenticado) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          {/* La ruta raíz ahora redirige a mainUserPath si está autenticado */}
          <Route
            index
            element={
              isAuthenticated ? (
                <Navigate to={mainUserPath} replace />
              ) : (
                <HomePage />
              )
            }
          />

          {/* *** NUEVA RUTA PARA USUARIO *** */}
          {/* Ruta específica para usuarios autenticados con rol USUARIO (o superior) */}
          <Route path="usuario" element={<UsuarioPage />} />

          {/* <Route path="profile" element={<UserProfilePage />} /> */}
        </Route>{' '}
        {/* Fin MainLayout */}
      </Route>{' '}
      {/* Fin Protección básica */}
      {/* --- Rutas Protegidas por Rol Específico --- */}
      <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
        <Route path="/owner" element={<MainLayout />}>
          <Route index element={<OwnerPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN']} />}>
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="user-management" element={<AdminPage />} />{' '}
          {/* O UserManagementPage */}
        </Route>
      </Route>
      <Route
        element={
          <ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'VENDEDOR']} />
        }
      >
        <Route path="/vendedor" element={<MainLayout />}>
          <Route index element={<VendedorPage />} />
        </Route>
      </Route>
      {/* --- Ruta Catch-all --- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
