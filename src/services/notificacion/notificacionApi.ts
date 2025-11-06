// src/services/notificacion/notificacionApi.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '@/services/types/ApiResponse';
import type { NotificacionDto } from '@/services/types/simple/NotificacionDto';

// --- Query Keys ---
export const NOTIFICACIONES_QUERY_KEY = ['notificaciones'];

// --- 1. GET /api/v1/notificaciones/me ---
const fetchMisNotificaciones = async (): Promise<
  ApiResponse<NotificacionDto[]>
> => {
  const { data } = await apiClient.get<ApiResponse<NotificacionDto[]>>(
    '/api/v1/notificaciones/me',
  );
  return data;
};

/**
 * Hook para obtener la lista de notificaciones del usuario autenticado.
 */
export const useMisNotificaciones = () => {
  return useQuery({
    queryKey: [NOTIFICACIONES_QUERY_KEY, 'me'],
    queryFn: fetchMisNotificaciones,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Cachear por 5 minutos
  });
};

// --- 2. PUT /api/v1/notificaciones/{id}/read ---
const markAsRead = async (
  id: number,
): Promise<ApiResponse<NotificacionDto>> => {
  const { data } = await apiClient.put<ApiResponse<NotificacionDto>>(
    `/api/v1/notificaciones/${id}/read`,
  );
  return data;
};

/**
 * Hook de mutación para marcar una notificación como leída.
 */
export const useMarcarComoLeida = () => {
  return useMutation({
    mutationFn: markAsRead,
    // No necesitamos invalidar la query, manejaremos el estado en el store
  });
};

// --- 3. DELETE /api/v1/notificaciones/{id} ---
const deleteNotificacion = async (id: number): Promise<ApiResponse<void>> => {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/api/v1/notificaciones/${id}`,
  );
  return data;
};

/**
 * Hook de mutación para eliminar una notificación.
 */
export const useEliminarNotificacion = () => {
  return useMutation({
    mutationFn: deleteNotificacion,
    // No necesitamos invalidar la query, manejaremos el estado en el store
  });
};
