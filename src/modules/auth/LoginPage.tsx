// src/modules/auth/LoginPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/services/auth/authStore';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { getRedirectPathForUser } from '@/utils/roleUtils';
import type { LoginFormValues } from '@/services/types/auth/LoginSchema';

export const LoginPage = () => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRedirectPathForUser(user);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLoginSubmit = async (data: LoginFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      await login(data);

      const currentUser = useAuthStore.getState().user;
      const redirectPath = getRedirectPathForUser(currentUser);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      console.error('Login failed in LoginPage:', err);
      const errorMessage =
        err?.response?.data?.message ||
        (err?.message?.includes('401') ? 'Credenciales inválidas.' : null) ||
        (err?.message?.includes('Network Error')
          ? 'No se pudo conectar al servidor.'
          : null) ||
        err?.message ||
        'Ocurrió un error inesperado.';

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded">
            {error}
          </div>
        )}

        <LoginForm
          onSubmit={handleLoginSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};
