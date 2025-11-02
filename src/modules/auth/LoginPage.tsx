import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/services/auth/authStore';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { getRedirectPathForUser } from '@/utils/roleUtils';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore((state) => ({
    login: state.login,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirección si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRedirectPathForUser(user);
      console.log(
        `[LoginPage Effect] Already authenticated. Redirecting to: ${redirectPath}`,
      );
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Callback para el formulario
  const handleLoginSuccess = () => {
    const currentUser = useAuthStore.getState().user;
    const redirectPath = getRedirectPathForUser(currentUser);
    console.log(
      `[handleLoginSuccess] Login successful. Redirecting to: ${redirectPath}`,
    );
    navigate(redirectPath, { replace: true });
  };

  // Muestra carga si está auth pero esperando datos del usuario
  if (isAuthenticated && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando datos del usuario...
      </div>
    );
  }

  // Muestra el formulario de login
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Iniciar Sesión
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}
        <LoginForm
          onLoginSubmit={login}
          setLoading={setLoading}
          setError={setError}
          onSuccess={handleLoginSuccess}
          isLoading={loading}
        />
      </div>
    </div>
  );
};
