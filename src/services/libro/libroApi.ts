// src/services/libroApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '@/services/types/ApiResponse';
import type { Page } from '@/services/types/Page';
import type { LibroDto } from '@/services/types/simple/LibroDto';
import type { LibroDetailDto } from '@/services/types/detail/LibroDetailDto';
import type { LibroCreateFormValues } from '@/services/types/libro/LibroCreateSchema';
import type { LibroUpdateFormValues } from '@/services/types/libro/LibroUpdateSchema';

// --- Query Keys ---
const LIBROS_QUERY_KEY = ['libros'];

// --- 1. GET /api/v1/libros (Paginado y con filtros) ---
export interface FetchLibrosParams {
  page: number;
  size: number;
  titulo?: string;
  autor?: string;
}

const fetchLibros = async ({
  page,
  size,
  titulo,
  autor,
}: FetchLibrosParams): Promise<ApiResponse<Page<LibroDto>>> => {
  // Construir parámetros de consulta
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: 'titulo,asc', // Ordenar por título por defecto
  });
  if (titulo) params.append('titulo', titulo);
  if (autor) params.append('autor', autor);

  const { data } = await apiClient.get<ApiResponse<Page<LibroDto>>>(
    `/api/v1/libros`,
    { params },
  );
  return data;
};

/**
 * Hook para obtener la lista paginada y filtrada de libros.
 */
export const useLibros = (params: FetchLibrosParams) => {
  return useQuery({
    // El 'params' objeto completo es parte de la key
    queryKey: [LIBROS_QUERY_KEY, params],
    queryFn: () => fetchLibros(params),
    refetchOnWindowFocus: false,
  });
};

// --- 2. GET /api/v1/libros/{isbn} ---
const fetchLibroDetail = async (
  isbn: string,
): Promise<ApiResponse<LibroDetailDto>> => {
  const { data } = await apiClient.get<ApiResponse<LibroDetailDto>>(
    `/api/v1/libros/${isbn}`,
  );
  return data;
};

/**
 * Hook para obtener los detalles de un solo libro.
 */
export const useLibroDetail = (isbn: string) => {
  return useQuery({
    queryKey: [LIBROS_QUERY_KEY, 'detail', isbn],
    queryFn: () => fetchLibroDetail(isbn),
    enabled: !!isbn, // Solo ejecutar si el ISBN no es nulo/vacío
  });
};

// --- 3. POST /api/v1/libros ---
const createLibro = async (
  libroData: LibroCreateFormValues,
): Promise<ApiResponse<LibroDto>> => {
  // Convertir el string YYYY-MM-DD del formulario a un Instant (string ISO)
  const payload = {
    ...libroData,
    fechaPublicacion: new Date(libroData.fechaPublicacion).toISOString(),
  };
  const { data } = await apiClient.post<ApiResponse<LibroDto>>(
    '/api/v1/libros',
    payload,
  );
  return data;
};

export const useCreateLibro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLibro,
    onSuccess: () => {
      // Invalidar todas las queries de 'libros' para refrescar la tabla
      queryClient.invalidateQueries({ queryKey: LIBROS_QUERY_KEY });
    },
  });
};

// --- 4. PUT /api/v1/libros/{isbn} ---
const updateLibro = async (
  libroData: LibroUpdateFormValues,
): Promise<ApiResponse<LibroDto>> => {
  // Convertir fecha a ISO string
  const payload = {
    ...libroData,
    fechaPublicacion: new Date(libroData.fechaPublicacion).toISOString(),
  };
  const { data } = await apiClient.put<ApiResponse<LibroDto>>(
    `/api/v1/libros/${libroData.isbn}`,
    payload,
  );
  return data;
};

export const useUpdateLibro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLibro,
    onSuccess: (_, variables) => {
      // Invalidar la lista paginada
      queryClient.invalidateQueries({ queryKey: LIBROS_QUERY_KEY });
      // Invalidar el detalle específico si está cacheado
      queryClient.invalidateQueries({
        queryKey: [LIBROS_QUERY_KEY, 'detail', variables.isbn],
      });
    },
  });
};

// --- 5. DELETE /api/v1/libros/{isbn} ---
const deleteLibro = async (isbn: string): Promise<ApiResponse<void>> => {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/api/v1/libros/${isbn}`,
  );
  return data;
};

export const useDeleteLibro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLibro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIBROS_QUERY_KEY });
    },
  });
};
