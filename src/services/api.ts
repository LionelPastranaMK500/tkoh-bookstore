// src/shared/api/axiosInstance.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/services/auth/authStore';
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
// Variable para controlar si ya se está refrescando el token
let isRefreshing = false;
// Cola de peticiones fallidas que esperan un nuevo token
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];
const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
// 1. Interceptor de Petición (Request Interceptor)
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
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    // Si el error no es 401, o si la petición ya es un reintento,rechazar
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    if (isRefreshing) {
      // Si ya se está refrescando, añadir la petición a la cola deespera
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
    originalRequest._retry = true;
    isRefreshing = true;
    const { refreshToken, logout } = useAuthStore.getState();
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }
    try {
      // Intentar refrescar el token
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {
          refreshToken,
        },
      );
      const newAccessToken = data.accessToken;
      // Actualizar el token en el store de Zustand
      useAuthStore.getState().setAccessToken(newAccessToken);
      // Actualizar la cabecera de la petición original
      originalRequest.headers.Authorization = `Bearer${newAccessToken}`;
      // Procesar la cola de peticiones pendientes con el nuevo token
      processQueue(null, newAccessToken);
      // Reintentar la petición original
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Si el refresco falla, desloguear al usuario
      processQueue(refreshError as AxiosError, null);
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
