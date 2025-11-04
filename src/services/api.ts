// src/services/api.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/services/auth/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 1. Interceptor de Petición (Request Interceptor)
// ESTE ESTÁ PERFECTO Y ES VITAL
// Añade el token 'Bearer' a todas las peticiones
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. Interceptor de Respuesta (Response Interceptor)
// ESTA ES LA VERSIÓN CORREGIDA Y SIMPLIFICADA
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (2xx), solo la devuelve
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Si el error es 401 (No Autorizado) y NO es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn('Token JWT expirado o inválido. Cerrando sesión.');

      // Llama a la función logout del "cerebro" (authStore)
      // Esto limpiará el accessToken del estado y de localStorage.
      useAuthStore.getState().logout();

      // Opcional: Redirigir al usuario a la página de login
      // (Asegúrate de no crear un bucle infinito si /login también falla)
      // window.location.href = '/login';
    }

    // Para cualquier otro error (o si es un 401 ya reintentado),
    // simplemente rechaza la promesa para que la lógica (try/catch) lo maneje.
    return Promise.reject(error);
  },
);

export default apiClient;
