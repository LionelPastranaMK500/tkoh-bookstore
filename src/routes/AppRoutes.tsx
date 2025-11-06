// src/routes/AppRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import { StompProvider } from '@/contexts/StompContext';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// Páginas Públicas (Auth)
import { LoginPage } from '@/modules/auth/LoginPage';
import { RegisterPage } from '@/modules/auth/RegisterPage';
import { ForgotPasswordPage } from '@/modules/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/modules/auth/ResetPasswordPage';
import HomePage from '@/modules/Home/pages/HomePage';

// --- Páginas del Dashboard ---
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import { ProfilePage } from '@/modules/profile/ProfilePage';
import { AdminPage } from '@/modules/admin/pages/AdminPage';
import { CategoriaPage } from '@/modules/categoria/pages/CategoriaPage';
import { EditorialPage } from '@/modules/editorial/pages/EditorialPage';
import { LibroPage } from '@/modules/libro/pages/LibroPage';
import { ChatPage } from '@/modules/chat/pages/ChatPage';
import { LogPage } from '@/modules/auditoria/pages/LogPage';
import { TareaPage } from '@/modules/tarea/pages/TareaPage';

// --- Importar Protected Route ---
import { ProtectedRoute } from './ProtectedRoute';

// Páginas Comunes (Errores)
import { NotFoundPage } from '../modules/common/NotFoundPage';
import { UnauthorizedPage } from '../modules/common/UnauthorizedPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* --- GRUPO 1: Rutas Públicas --- */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* --- GRUPO 2: Rutas Protegidas (Dashboard) --- */}
      <Route element={<MainLayout />}>
        {/* Rutas que solo requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/editoriales" element={<EditorialPage />} />
          <Route path="/libros" element={<LibroPage />} />

          {/* Ruta de Chat (requiere StompProvider) */}
          <Route
            path="/chat"
            element={
              <StompProvider>
                <ChatPage />
              </StompProvider>
            }
          />
        </Route>

        {/* Rutas con permisos específicos (Admin/Owner) */}

        <Route
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'VENDEDOR']} />
          }
        >
          <Route path="/tareas" element={<TareaPage />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={['OWNER', 'USER_READ_ALL']} />}
        >
          <Route path="/admin/users" element={<AdminPage />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={['OWNER', 'LOG_READ']} />}
        >
          <Route path="/admin/logs" element={<LogPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'CATEGORY_READ_ALL']} />
          }
        >
          <Route path="/categorias" element={<CategoriaPage />} />
        </Route>
      </Route>

      {/* --- Rutas de Error --- */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
