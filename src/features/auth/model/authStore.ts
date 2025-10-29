// src/model/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// 1. Importa 'type' y corrige la ruta al archivo que acabamos de crear
import type { User } from '@/entities/user/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  // 2. Modifica 'login' para que solo reciba los DATOS, no las credenciales
  login: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    // 3. (set, get) -> (set). El 'get' no se usaba, lo quitamos por limpieza.
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      // 4. 'login' ahora solo guarda el estado.
      // ¡La llamada a la API la haremos en el componente LoginForm!
      login: (data) => {
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },
      logout: () => {
        // La llamada de logout a la API también debería hacerse
        // en el componente donde esté el botón de "Cerrar Sesión".
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        // Redirigir al login
        window.location.href = '/login';
      },
      setAccessToken: (token: string) => {
        set({ accessToken: token });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
