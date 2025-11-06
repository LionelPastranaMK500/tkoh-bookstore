// src/services/tarea/tareaApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '@/services/types/ApiResponse';
import type { Page } from '@/services/types/Page';
import type { TareaDto } from '@/services/types/simple/TareaDto';
import type { FetchTareasParams } from '@/services/types/tarea/FetchTareasParams';
import type { TareaCreateFormValues } from '@/services/types/tarea/TareaCreateSchema';
import type { TareaUpdateFormValues } from '@/services/types/tarea/TareaUpdateSchema';

// --- Query Keys ---
export const TAREAS_QUERY_KEY = ['tareas'];

// --- 1. GET /api/v1/tareas O GET /api/v1/tareas/me ---
const fetchTareas = async ({
  page,
  size,
  scope,
  completado,
}: FetchTareasParams): Promise<ApiResponse<Page<TareaDto>>> => {
  const endpoint = scope === 'all' ? '/api/v1/tareas' : '/api/v1/tareas/me';

  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: 'fechaCreacion,desc',
  });

  if (scope === 'me' && completado !== undefined) {
    params.append('completado', String(completado));
  }

  const { data } = await apiClient.get<ApiResponse<Page<TareaDto>>>(endpoint, {
    params,
  });
  return data;
};

/**
 * Hook para obtener la lista paginada de tareas (todas o solo las mías).
 */
export const useTareas = (params: FetchTareasParams) => {
  return useQuery({
    queryKey: [TAREAS_QUERY_KEY, params],
    queryFn: () => fetchTareas(params),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 minuto
  });
};

// --- 2. GET /api/v1/tareas/{id} ---
const fetchTareaDetail = async (id: number): Promise<ApiResponse<TareaDto>> => {
  const { data } = await apiClient.get<ApiResponse<TareaDto>>(
    `/api/v1/tareas/${id}`,
  );
  return data;
};

/**
 * Hook para obtener los detalles de una sola tarea.
 */
export const useTareaDetail = (id: number) => {
  return useQuery({
    queryKey: [TAREAS_QUERY_KEY, 'detail', id],
    queryFn: () => fetchTareaDetail(id),
    enabled: !!id,
  });
};

// --- 3. POST /api/v1/tareas ---
const createTarea = async (
  tareaData: TareaCreateFormValues,
): Promise<ApiResponse<TareaDto>> => {
  const payload = {
    ...tareaData,
    fechaLimite: tareaData.fechaLimite
      ? new Date(tareaData.fechaLimite).toISOString()
      : null,
  };
  const { data } = await apiClient.post<ApiResponse<TareaDto>>(
    '/api/v1/tareas',
    payload,
  );
  return data;
};

export const useCreateTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAREAS_QUERY_KEY });
    },
  });
};

// --- 4. PUT /api/v1/tareas/{id} ---
const updateTarea = async (
  tareaData: TareaUpdateFormValues,
): Promise<ApiResponse<TareaDto>> => {
  const payload = {
    ...tareaData,
    fechaLimite: tareaData.fechaLimite
      ? new Date(tareaData.fechaLimite).toISOString()
      : null,
  };
  const { data } = await apiClient.put<ApiResponse<TareaDto>>(
    `/api/v1/tareas/${tareaData.id}`,
    payload,
  );
  return data;
};

export const useUpdateTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTarea,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TAREAS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [TAREAS_QUERY_KEY, 'detail', variables.id],
      });
    },
  });
};

// --- 5. DELETE /api/v1/tareas/{id} ---
const deleteTarea = async (id: number): Promise<ApiResponse<void>> => {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/api/v1/tareas/${id}`,
  );
  return data;
};

export const useDeleteTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAREAS_QUERY_KEY });
    },
  });
};
