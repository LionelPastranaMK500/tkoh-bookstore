// src/services/auth/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '@/services/api';
import type { User } from '@/services/types/User';
import type { ApiResponse } from '@/services/types/ApiResponse';
import type { AuthState } from '@/services/types/AuthState';
import type { LoginCredentials } from '@/services/types/auth/LoginCredentials';
import type { LoginResponse } from '@/services/types/auth/LoginResponse';
import type { RegisterCredentials } from '@/services/types/auth/RegisterCredentials';
import type { RegisterResponse } from '@/services/types/auth/RegisterResponse';
import type { ForgotPasswordCredentials } from '@/services/types/auth/ForgotPasswordCredentials';
import type { ResetPasswordCredentials } from '@/services/types/auth/ResetPasswordCredentials';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // --- 1. LOGIN ---
      login: async (credentials: LoginCredentials) => {
        console.log('Iniciando login con:', credentials.email);
        try {
          const { data: loginData } = await apiClient.post<
            ApiResponse<LoginResponse>
          >('/api/v1/auth/login', credentials);

          if (loginData.success && loginData.data.token) {
            const token = loginData.data.token;
            set({
              accessToken: token,
              isAuthenticated: true,
              user: null,
            });
            apiClient.defaults.headers.common['Authorization'] =
              `Bearer ${token}`;
            await get().fetchUser(); // Llama a fetchUser después de loguear
            console.log('Login successful, user data fetched.');
          } else {
            get().logout();
            throw new Error(
              loginData.message || 'Error en la respuesta del servidor',
            );
          }
        } catch (error: any) {
          get().logout(); // Limpia el estado si el login falla
          throw error;
        }
      },

      // --- 2. REGISTER ---
      register: async (credentials: RegisterCredentials) => {
        console.log('Iniciando registro para:', credentials.email);
        try {
          // Llama al endpoint y devuelve la respuesta
          const { data: registerData } = await apiClient.post<
            ApiResponse<RegisterResponse>
          >('/api/v1/auth/register', credentials);

          return registerData;
        } catch (error: any) {
          console.error('Register request failed in store:', error);
          throw error; // La página que llama manejará el error
        }
      },

      // --- 3. FORGOT PASSWORD ---
      forgotPassword: async (credentials: ForgotPasswordCredentials) => {
        console.log('Solicitando OTP para:', credentials.identificador);
        try {
          // Llama al endpoint y devuelve la respuesta
          const { data: forgotData } = await apiClient.post<ApiResponse<void>>(
            '/api/v1/auth/forgot-password',
            credentials,
          );
          return forgotData;
        } catch (error: any) {
          console.error('Forgot password request failed in store:', error);
          throw error;
        }
      },

      // --- 4. RESET PASSWORD ---
      resetPassword: async (credentials: ResetPasswordCredentials) => {
        console.log('Reseteando contraseña para:', credentials.email);
        try {
          // Llama al endpoint y devuelve la respuesta
          const { data: resetData } = await apiClient.post<ApiResponse<void>>(
            '/api/v1/auth/reset-password',
            credentials,
          );
          return resetData;
        } catch (error: any) {
          console.error('Reset password request failed in store:', error);
          throw error;
        }
      },

      // --- 5. FETCH USER (Lógica de soporte) ---
      fetchUser: async () => {
        const token = get().accessToken;
        if (!token) {
          console.log('fetchUser skipped: No access token');
          return;
        }
        try {
          // Asegurarnos que el header esté puesto (para rehidratación)
          if (!apiClient.defaults.headers.common['Authorization']) {
            apiClient.defaults.headers.common['Authorization'] =
              `Bearer ${token}`;
          }

          const { data: userDataResponse } =
            await apiClient.get<ApiResponse<User>>('/api/v1/users/me');

          if (userDataResponse.success && userDataResponse.data) {
            set({ user: userDataResponse.data, isAuthenticated: true });
            console.log('User data fetched and stored:', userDataResponse.data);
          } else {
            console.error('Fetch user API error:', userDataResponse.message);
            get().logout(); // Si falla obtener datos, cerramos sesión
            throw new Error(
              userDataResponse.message || 'Error al obtener datos del usuario',
            );
          }
        } catch (error) {
          console.error('Fetch user request failed:', error);
          get().logout(); // Si la petición falla (ej. 401), cerramos sesión
          throw error;
        }
      },

      // --- 6. LOGOUT (Lógica de soporte) ---
      logout: () => {
        console.log('Logging out...');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
        delete apiClient.defaults.headers.common['Authorization'];
      },

      // --- 7. SET ACCESS TOKEN (Lógica de soporte) ---
      setAccessToken: (token: string) => {
        set({ accessToken: token });
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
    }),
    {
      name: 'auth-storage', // Nombre para localStorage
      storage: createJSONStorage(() => localStorage),
      // Persistimos solo el token. El usuario se obtendrá fresco al recargar.
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
      // Lógica para rehidratar el estado al cargar la app
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate auth state:', error);
          state?.logout();
        } else if (state?.accessToken) {
          console.log('Rehydrating auth state with token.');
          apiClient.defaults.headers.common['Authorization'] =
            `Bearer ${state.accessToken}`;
          state.isAuthenticated = true; // Asumimos autenticado si hay token

          // Intentar obtener datos frescos del usuario al cargar
          setTimeout(() => {
            state.fetchUser().catch((fetchError) => {
              console.warn(
                'Failed to fetch user on rehydration (token might be expired):',
                fetchError.message,
              );
              // fetchUser() ya maneja el logout en caso de error
            });
          }, 1);
        } else {
          console.log('No auth token found in storage.');
          state?.logout(); // Nos aseguramos que esté limpio si no hay token
        }
      },
    },
  ),
);
