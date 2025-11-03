import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/services/auth/authStore';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { getRedirectPathForUser } from '@/utils/roleUtils';

export const LoginPage = () => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRedirectPathForUser(user);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLoginSuccess = () => {
    const currentUser = useAuthStore.getState().user;
    const redirectPath = getRedirectPathForUser(currentUser);
    navigate(redirectPath, { replace: true });
  };
  if (isAuthenticated && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando datos del usuario...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 md:py-20">
      <div className="p-8 bg-card text-card-foreground rounded-lg shadow-md w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
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
