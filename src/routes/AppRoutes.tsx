// src/routes/AppRoutes.tsx
import { Route, Routes } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// Páginas Públicas (Auth)
import HomePage from '@/modules/Home/pages/HomePage';
import { LoginPage } from '@/modules/auth/LoginPage';
import { RegisterPage } from '@/modules/auth/RegisterPage';
import { ForgotPasswordPage } from '@/modules/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/modules/auth/ResetPasswordPage';

// --- 1. Importar las páginas del Dashboard (CORREGIDO) ---
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'; // NUEVO
import { ProfilePage } from '@/modules/profile/ProfilePage'; // NUEVO
import { AdminPage } from '@/modules/admin/pages/AdminPage'; // (placeholder existente)
// (Ya no importamos 'UsuarioPage' para esto)

// Páginas Comunes (Errores)
import { NotFoundPage } from '../modules/common/NotFoundPage';
import { UnauthorizedPage } from '../modules/common/UnauthorizedPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* --- GRUPO 1: Rutas Públicas (Layout simple, sin Sidebar) --- */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* --- GRUPO 2: Rutas del Dashboard (Layout con Sidebar) --- */}
      {/* (Como dijimos, públicas por ahora) */}
      <Route element={<MainLayout />}>
        {/* --- 2. RUTAS CORREGIDAS --- */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/perfil" element={<ProfilePage />} />

        {/* Rutas de Gestión (Placeholders) */}
        <Route path="/libros" element={<AdminPage />} />
        <Route path="/categorias" element={<AdminPage />} />
        <Route path="/editoriales" element={<AdminPage />} />

        {/* Ruta de Administración */}
        <Route path="/admin/users" element={<AdminPage />} />
      </Route>

      {/* --- Rutas de Error (Layout limpio) --- */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
