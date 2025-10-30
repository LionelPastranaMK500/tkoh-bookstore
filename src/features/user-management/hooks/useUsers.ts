// src/features/user-management/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/userApi'; // Importar la función de API

// Clave única para la caché de TanStack Query
const USERS_QUERY_KEY = ['adminUsers']; // Usar una clave más específica

/**
 * Hook personalizado para obtener la lista paginada de usuarios (desde admin endpoint).
 * Utiliza TanStack Query para gestionar el fetching, caching, y estados.
 * @returns El resultado de useQuery, que incluye:
 * - data: La respuesta de la API (ApiResponse<Page<User>>) o undefined.
 * - isLoading: boolean indicando si la petición inicial está en curso.
 * - isFetching: boolean indicando si alguna petición (inicial o refetch) está en curso.
 * - error: El objeto Error si la petición falló, o null.
 * - refetch: Función para volver a ejecutar la consulta manualmente.
 */
export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY, // Clave para identificar esta query en la caché
    queryFn: fetchUsers, // La función que realmente hace la llamada a la API
    // Opciones adicionales (opcionales):
    // staleTime: 5 * 60 * 1000, // Considerar datos frescos por 5 minutos
    refetchOnWindowFocus: false, // Evitar refetch automático al cambiar de pestaña
  });
};
