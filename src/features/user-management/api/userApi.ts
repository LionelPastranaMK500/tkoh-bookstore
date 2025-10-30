// src/features/user-management/api/userApi.ts
import apiClient from '@/shared/api/axiosInstance';
import type { User } from '@/features/auth/interface/User'; // Ajusta la ruta si es necesario
import type { ApiResponse } from '@/features/auth/interface/Auxiliar'; // Ajusta la ruta si es necesario
import type { Page } from '@/features/auth/interface/Page'; // Importar la interfaz Page general

/**
 * Llama al endpoint de la API para obtener una lista paginada de usuarios.
 * Asume que la API devuelve ApiResponse anidando un objeto Page<User>.
 * Endpoint: GET /api/v1/admin/users
 * @returns Promise<ApiResponse<Page<User>>>
 */
export const fetchUsers = async (): Promise<ApiResponse<Page<User>>> => {
  // Nota: Si tu API requiere parámetros de paginación (page, size, sort),
  // deberás añadirlos aquí como query params.
  // Ejemplo: const response = await apiClient.get<ApiResponse<Page<User>>>('/api/v1/admin/users?page=0&size=10');
  console.log('Fetching users from API...'); // Log para depuración
  try {
    const response = await apiClient.get<ApiResponse<Page<User>>>(
      '/api/v1/admin/users',
    );
    console.log('Users fetched successfully:', response.data); // Log de éxito
    return response.data; // Devuelve solo la parte 'data' de la respuesta de Axios
  } catch (error) {
    console.error('Error fetching users:', error); // Log de error
    throw error; // Relanza el error para que React Query lo maneje
  }
};
