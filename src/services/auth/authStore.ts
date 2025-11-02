import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// >>>>> RUTAS DE IMPORTACIÓN ACTUALIZADAS <<<<<
import type { User } from '@/services/types/User';
import apiClient from '@/shared/api/axiosInstance';
import type { LoginResponse } from '@/services/types/LoginResponse';
import type { AuthState } from '@/services/types/AuthState';
import type { ApiResponse } from '@/services/types/Auxiliar';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      // --- LOGIN MODIFICADO ---
      login: async (credentials) => {
        try {
          // 1. Llamar al endpoint de login
          const { data: loginData } = await apiClient.post<
            ApiResponse<LoginResponse>
          >('/api/v1/auth/login', credentials); // Usamos la interfaz ApiResponse genérica

          if (loginData.success && loginData.data.token) {
            const token = loginData.data.token;
            // 2. Guardar el token en el estado y en el header por defecto de apiClient
            set({
              accessToken: token,
              isAuthenticated: true, // Marcamos como autenticado TEMPORALMENTE
              user: null, // Limpiamos datos de usuario previos
            });
            apiClient.defaults.headers.common['Authorization'] =
              `Bearer ${token}`;

            // 3. Llamar a la nueva acción para obtener los datos del usuario
            await get().fetchUser();

            console.log('Login successful, user data fetched.');
          } else {
            console.error('Login API error:', loginData.message);
            // Limpiar estado en caso de error de API tras respuesta 200 OK
            get().logout(); // Llama a logout para limpiar estado
            throw new Error(
              loginData.message || 'Error en la respuesta del servidor',
            );
          }
        } catch (error: any) {
          console.error('Login request failed:', error);
          // Limpiar estado en caso de error de red o 4xx/5xx
          get().logout(); // Llama a logout para limpiar estado
          // Relanzar el error para que el componente LoginForm pueda manejarlo
          throw error;
        }
      },

      // --- NUEVA ACCIÓN: FETCH USER ---
      fetchUser: async () => {
        const token = get().accessToken;
        if (!token) {
          console.log('fetchUser skipped: No access token');
          // Podríamos llamar a logout aquí si se espera token pero no hay
          // get().logout();
          return; // Salir si no hay token
        }
        try {
          // Asegúrate que apiClient tenga el token en sus headers por defecto
          if (!apiClient.defaults.headers.common['Authorization']) {
            apiClient.defaults.headers.common['Authorization'] =
              `Bearer ${token}`;
          }

          // Llamar al endpoint que devuelve los datos del usuario logueado (/api/v1/users/me)
          const { data: userDataResponse } =
            await apiClient.get<ApiResponse<User>>('/api/v1/users/me'); // Esperamos ApiResponse<User> (ajusta si tu API devuelve UsuarioDetailDto aquí)

          if (userDataResponse.success && userDataResponse.data) {
            // Guardar los datos del usuario en el estado
            set({ user: userDataResponse.data, isAuthenticated: true }); // Confirmamos autenticación ahora que tenemos datos
            console.log('User data fetched and stored:', userDataResponse.data);
          } else {
            console.error('Fetch user API error:', userDataResponse.message);
            // Si falla obtener datos del usuario DESPUÉS de tener token, es un error -> logout
            get().logout();
            throw new Error(
              userDataResponse.message || 'Error al obtener datos del usuario',
            );
          }
        } catch (error) {
          console.error('Fetch user request failed:', error);
          // Si falla la petición de datos del usuario, consideramos que no está autenticado -> logout
          get().logout(); // Llama a logout para limpiar estado
          // Podrías relanzar el error si necesitas manejarlo en otro lugar
          throw error;
        }
      },

      // --- LOGOUT (modificado para limpiar apiClient) ---
      logout: () => {
        console.log('Logging out...');
        // Limpiar estado
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
        // Limpiar token de los headers por defecto de axios
        delete apiClient.defaults.headers.common['Authorization'];
        // Opcional: Redirigir al login (mejor hacerlo en el componente o router)
        // window.location.href = '/login';
      },

      // --- SET ACCESS TOKEN (sin cambios, útil para interceptor) ---
      setAccessToken: (token: string) => {
        set({ accessToken: token });
        // También actualizamos el header por defecto si se llama externamente
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
    }),
    {
      name: 'auth-storage', // Nombre para localStorage
      storage: createJSONStorage(() => localStorage),
      // Persistir solo el token (el usuario se obtiene con fetchUser)
      // Si guardas el usuario aquí, podría quedar desactualizado.
      // Si DECIDES persistir el usuario, asegúrate de actualizarlo.
      partialize: (state) => ({
        accessToken: state.accessToken,
        // user: state.user, // Descomenta si quieres persistir el usuario también
        // isAuthenticated: state.isAuthenticated // Podrías persistir esto
      }),
      // --- REHYDRATION LOGIC (Opcional pero recomendado) ---
      // Esta función se ejecuta cuando el estado se carga desde localStorage
      onRehydrateStorage: (_state) => {
        console.log('Rehydrating auth state...');
        return (currentState, error) => {
          if (error) {
            console.error('Failed to rehydrate auth state:', error);
            // Si hay error, limpiar el estado para evitar problemas
            currentState?.logout();
          } else if (currentState?.accessToken) {
            console.log(
              'Access token found in storage. Setting axios header and attempting to fetch user.',
            );
            // Si tenemos token, configuramos axios y tratamos de obtener datos frescos del usuario
            apiClient.defaults.headers.common['Authorization'] =
              `Bearer ${currentState.accessToken}`;
            currentState.isAuthenticated = true; // Asumimos autenticado si hay token
            // Intentar obtener datos frescos del usuario al cargar la app
            // Usamos un setTimeout para evitar potenciales problemas de timing
            setTimeout(() => {
              currentState.fetchUser().catch((fetchError) => {
                // fetchUser ya maneja el logout en caso de error, solo logueamos aquí
                console.warn(
                  'Failed to fetch user on rehydration:',
                  fetchError,
                );
              });
            }, 0);
          } else {
            console.log('No access token found in storage.');
            // Asegurarse de que el estado esté limpio si no hay token
            currentState?.logout();
          }
        };
      },
    },
  ),
);
