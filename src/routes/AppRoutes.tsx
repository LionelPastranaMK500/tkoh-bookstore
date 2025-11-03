// src/routes/AppRoutes.tsx
import { Route, Routes } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';

// Páginas Públicas (contenedores de lógica)
import HomePage from '@/modules/Home/pages/HomePage';
import { LoginPage } from '@/modules/auth/LoginPage';
import { RegisterPage } from '@/modules/auth/RegisterPage';
import { ForgotPasswordPage } from '@/modules/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/modules/auth/ResetPassword';

// Páginas Comunes (Errores)
import { NotFoundPage } from '../modules/common/NotFoundPage';
import { UnauthorizedPage } from '../modules/common/UnauthorizedPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* --- GRUPO 1: Rutas Públicas (envueltas en AuthLayout) --- */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* --- Rutas de Error (fuera de cualquier layout) --- */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
