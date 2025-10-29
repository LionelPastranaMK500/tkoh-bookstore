import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { UserProfilePage } from '@/pages/UserProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// 1. Importamos los nuevos componentes
import { ProtectedRoute } from './ProtectedRoute';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';

export const AppRouter = () => (
  <Routes>
    {/* ---------------- RUTAS PÚBLICAS ---------------- */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFoundPage />} />

    {/* ---------------- RUTAS PRIVADAS ---------------- */}
    <Route path="/" element={<MainLayout />}>
      {/* Ruta de bienvenida (protegida por defecto por estar dentro de MainLayout) */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* Ruta de perfil (corregí la del PDF, la tuya original tenía :userId) */}
      <Route element={<ProtectedRoute />}>
        <Route path="profile/:userId" element={<UserProfilePage />} />
      </Route>

      {/* Ruta de Admin (protegida con rol específico) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
      </Route>

      {/* ...otras rutas protegidas anidadas aquí... */}
    </Route>
  </Routes>
);
