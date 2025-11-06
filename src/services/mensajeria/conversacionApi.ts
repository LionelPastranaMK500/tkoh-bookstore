// src/services/conversacionApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '@/services/types/ApiResponse';
import type { ConversacionDto } from '@/services/types/simple/ConversacionDto';
import type { ConversacionDetailDto } from '@/services/types/detail/ConversacionDetailDto';
import type { MensajeDto } from '@/services/types/simple/MensajeDto';
import type { ConversacionCreateFormValues } from '@/services/types/conversacion/ConversacionCreateSchema';
import type { MensajeCreateFormValues } from '@/services/types/conversacion/MensajeCreateSchema';

// --- Query Keys ---
const CONVERSACIONES_KEY = ['conversaciones'];

// --- 1. GET /api/v1/conversaciones/me ---
const fetchMisConversaciones = async (): Promise<
  ApiResponse<ConversacionDto[]>
> => {
  const { data } = await apiClient.get<ApiResponse<ConversacionDto[]>>(
    '/api/v1/conversaciones/me',
  );
  return data;
};

/**
 * Hook para obtener la lista de conversaciones del usuario autenticado.
 */
export const useMisConversaciones = () => {
  return useQuery({
    queryKey: [CONVERSACIONES_KEY, 'me'],
    queryFn: fetchMisConversaciones,
    refetchOnWindowFocus: false,
  });
};

// --- 2. GET /api/v1/conversaciones/{id}/mensajes ---
const fetchMensajes = async (
  conversacionId: number,
): Promise<ApiResponse<MensajeDto[]>> => {
  const { data } = await apiClient.get<ApiResponse<MensajeDto[]>>(
    `/api/v1/conversaciones/${conversacionId}/mensajes`,
  );
  return data;
};

/**
 * Hook para obtener el historial de mensajes de una conversación.
 */
export const useMensajes = (conversacionId: number) => {
  return useQuery({
    queryKey: [CONVERSACIONES_KEY, 'detail', conversacionId, 'mensajes'],
    queryFn: () => fetchMensajes(conversacionId),
    enabled: !!conversacionId,
  });
};

// --- 3. GET /api/v1/conversaciones/{id} ---
const fetchConversacionDetail = async (
  id: number,
): Promise<ApiResponse<ConversacionDetailDto>> => {
  const { data } = await apiClient.get<ApiResponse<ConversacionDetailDto>>(
    `/api/v1/conversaciones/${id}`,
  );
  return data;
};

/**
 * Hook para obtener los detalles de una conversación (participantes y mensajes).
 * (Nota: 'useMensajes' es más ligero si solo quieres los mensajes)
 */
export const useConversacionDetail = (id: number) => {
  return useQuery({
    queryKey: [CONVERSACIONES_KEY, 'detail', id],
    queryFn: () => fetchConversacionDetail(id),
    enabled: !!id,
  });
};

// --- 4. POST /api/v1/conversaciones ---
const iniciarConversacion = async (
  newData: ConversacionCreateFormValues,
): Promise<ApiResponse<ConversacionDto>> => {
  const { data } = await apiClient.post<ApiResponse<ConversacionDto>>(
    '/api/v1/conversaciones',
    newData,
  );
  return data;
};

/**
 * Hook de mutación para crear una nueva conversación.
 */
export const useIniciarConversacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: iniciarConversacion,
    onSuccess: () => {
      // Invalidar la lista de "mis conversaciones"
      queryClient.invalidateQueries({
        queryKey: [CONVERSACIONES_KEY, 'me'],
      });
    },
  });
};

// --- 5. POST /api/v1/conversaciones/{id}/mensajes ---
interface SendMensajeParams {
  conversacionId: number;
  mensajeData: MensajeCreateFormValues;
}

const enviarMensaje = async ({
  conversacionId,
  mensajeData,
}: SendMensajeParams): Promise<ApiResponse<MensajeDto>> => {
  const { data } = await apiClient.post<ApiResponse<MensajeDto>>(
    `/api/v1/conversaciones/${conversacionId}/mensajes`,
    mensajeData,
  );
  return data;
};

/**
 * Hook de mutación para enviar un mensaje.
 * No necesitamos invalidar la query de 'useMensajes' porque
 * el listener de WebSocket se encargará de añadir el mensaje
 * en tiempo real.
 */
export const useEnviarMensaje = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enviarMensaje,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONVERSACIONES_KEY, 'me'],
      });
    },
  });
};
