import { useState, useEffect } from 'react';
// Quitamos la importación nombrada 'Navigate' que no se usa
import { useNavigate } from 'react-router-dom'; // Renombramos Navigate a NavigateComponent para claridad
import { useAuthStore } from '@/services/auth/authStore';
import { LoginForm } from '@/modules/auth/components/LoginForm'; // Verifica esta ruta
// Asegúrate que la ruta a roleUtils sea correcta según donde lo pusiste
import { getRedirectPathForUser } from '@/utils/roleUtils'; // Esta ruta está bien confirmada por ti
// import type { User } from '@/features/auth/interface/User'; // El tipo User sí se usa

export const LoginPage = () => {
  const navigate = useNavigate();
  // Añadimos comentario para ESLint/TS sobre fetchUser
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login, isAuthenticated, user } = useAuthStore(
    // fetchUser se usa indirectamente por login y rehidratación
    (state) => ({
      login: state.login,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      fetchUser: state.fetchUser,
    }),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Lógica de Redirección si ya está autenticado ---
  useEffect(() => {
    // Solo redirige si está autenticado Y tenemos datos del usuario
    if (isAuthenticated && user) {
      const redirectPath = getRedirectPathForUser(user);
      console.log(
        `[LoginPage Effect] Already authenticated. Redirecting to: ${redirectPath}`,
      );
      navigate(redirectPath, { replace: true });
    } else if (isAuthenticated && !user) {
      console.log('[LoginPage Effect] Authenticated but user data pending...');
    }
    // Si no está autenticado (isAuthenticated es false), no hace nada y muestra el formulario.
  }, [isAuthenticated, user, navigate]); // Dependencias del efecto

  // --- Función llamada por LoginForm en caso de éxito ---
  const handleLoginSuccess = () => {
    // Leer el estado más reciente después de que login (y fetchUser) hayan terminado
    const currentUser = useAuthStore.getState().user;
    const redirectPath = getRedirectPathForUser(currentUser);
    console.log(
      `[handleLoginSuccess] Login successful. Redirecting to: ${redirectPath}`,
    );
    navigate(redirectPath, { replace: true });
  };

  // --- Mostrar carga si está autenticado pero sin datos de usuario ---
  // Este estado puede ocurrir brevemente al recargar la página si hay un token válido
  // pero fetchUser aún no ha terminado.
  if (isAuthenticated && !user) {
    // No es necesario el doble check de isAuthenticated
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando datos del usuario... {/* O un componente Spinner */}
      </div>
    );
  }

  // --- Renderizado principal ---
  // Si ya está autenticado Y tiene datos de usuario, el useEffect ya habrá redirigido.
  // Si está autenticado pero SIN datos de usuario, muestra "Cargando...".
  // Si NO está autenticado, muestra el formulario.
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Iniciar Sesión
        </h2>
        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {/* Mensajes de error más específicos */}
            {error.includes('Network Error') ||
            error.includes('Failed to fetch')
              ? 'Error de red. No se pudo conectar al servidor.'
              : error.includes('401') ||
                  error.toLowerCase().includes('credential')
                ? 'Credenciales inválidas.'
                : error}
          </div>
        )}
        {/* Componente LoginForm con props */}
        <LoginForm
          onLoginSubmit={login} // Pasa la función login del store
          setLoading={setLoading} // Pasa la función para actualizar loading
          setError={setError} // Pasa la función para actualizar error
          onSuccess={handleLoginSuccess} // Pasa la función a ejecutar en caso de éxito
          isLoading={loading} // Pasa el estado de loading
        />
      </div>
    </div>
  );
};
