// src/services/auditoria/logApi.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '@/services/types/ApiResponse';
import type { Page } from '@/services/types/Page';
import type { LogActividadDto } from '@/services/types/simple/LogActividadDto';
import type { FetchLogsParams } from '@/services/types/auditoria/FetchLogsParams';

// --- Query Keys ---
export const LOGS_QUERY_KEY = ['logs'];

// --- 1. GET /api/v1/logs (Paginado y con filtros) ---
const fetchLogs = async (
  params: FetchLogsParams,
): Promise<ApiResponse<Page<LogActividadDto>>> => {
  // Construir parámetros de consulta
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    sort: 'fecha,desc', // Ordenar por fecha descendente por defecto
  });

  if (params.nombreUsuario)
    queryParams.append('nombreUsuario', params.nombreUsuario);
  if (params.accion) queryParams.append('accion', params.accion);

  const { data } = await apiClient.get<ApiResponse<Page<LogActividadDto>>>(
    `/api/v1/logs`,
    { params: queryParams },
  );
  return data;
};

/**
 * Hook para obtener la lista paginada y filtrada de logs.
 */
export const useLogs = (params: FetchLogsParams) => {
  return useQuery({
    queryKey: [LOGS_QUERY_KEY, params],
    queryFn: () => fetchLogs(params),
    refetchOnWindowFocus: false,
  });
};

// --- 2. GET /api/v1/logs/{id} ---
const fetchLogDetail = async (
  id: number,
): Promise<ApiResponse<LogActividadDto>> => {
  const { data } = await apiClient.get<ApiResponse<LogActividadDto>>(
    `/api/v1/logs/${id}`,
  );
  return data;
};

/**
 * Hook para obtener el detalle de una sola entrada de log.
 */
export const useLogDetail = (id: number) => {
  return useQuery({
    queryKey: [LOGS_QUERY_KEY, 'detail', id],
    queryFn: () => fetchLogDetail(id),
    enabled: !!id,
  });
};
