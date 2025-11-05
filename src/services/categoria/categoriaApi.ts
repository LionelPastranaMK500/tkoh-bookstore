// src/services/categoriaApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '@/services/types/ApiResponse';
import type { Page } from '@/services/types/Page';
import type { CategoriaDto } from '@/services/types/simple/CategoriaDto'; // Asumimos que crearás este tipo
import type { CategoriaDetailDto } from '@/services/types/detail/CategoriaDetailDto'; // Asumimos que crearás este tipo
import type { CategoriaCreateFormValues } from '@/services/types/categoria/CategoriaCreateSchema';
import type { CategoriaUpdateFormValues } from '@/services/types/categoria/CategoriaUpdateSchema';

// --- Query Keys ---
const CATEGORIAS_QUERY_KEY = ['categorias'];

// --- 1. GET /api/v1/categorias (Paginado) ---
const fetchCategorias = async (
  pageable: { page: number; size: number } = { page: 0, size: 10 },
): Promise<ApiResponse<Page<CategoriaDto>>> => {
  const { data } = await apiClient.get<ApiResponse<Page<CategoriaDto>>>(
    `/api/v1/categorias?page=${pageable.page}&size=${pageable.size}&sort=id,asc`,
  );
  return data;
};

export const useCategorias = (
  pageable: { page: number; size: number } = { page: 0, size: 10 },
) => {
  return useQuery({
    queryKey: [CATEGORIAS_QUERY_KEY, pageable],
    queryFn: () => fetchCategorias(pageable),
    refetchOnWindowFocus: false,
  });
};

// --- 2. GET /api/v1/categorias/{id} ---
const fetchCategoriaDetail = async (
  id: number,
): Promise<ApiResponse<CategoriaDetailDto>> => {
  const { data } = await apiClient.get<ApiResponse<CategoriaDetailDto>>(
    `/api/v1/categorias/${id}`,
  );
  return data;
};

export const useCategoriaDetail = (id: number) => {
  return useQuery({
    queryKey: [CATEGORIAS_QUERY_KEY, 'detail', id],
    queryFn: () => fetchCategoriaDetail(id),
    enabled: !!id,
  });
};

// --- 3. POST /api/v1/categorias ---
const createCategoria = async (
  categoriaData: CategoriaCreateFormValues,
): Promise<ApiResponse<CategoriaDto>> => {
  const { data } = await apiClient.post<ApiResponse<CategoriaDto>>(
    '/api/v1/categorias',
    categoriaData,
  );
  return data;
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
    },
  });
};

// --- 4. PUT /api/v1/categorias/{id} ---
const updateCategoria = async (
  categoriaData: CategoriaUpdateFormValues,
): Promise<ApiResponse<CategoriaDto>> => {
  const { data } = await apiClient.put<ApiResponse<CategoriaDto>>(
    `/api/v1/categorias/${categoriaData.id}`,
    categoriaData,
  );
  return data;
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategoria,
    onSuccess: (_, variables) => {
      // Invalidar la lista paginada
      queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
      // Invalidar el detalle específico si está cacheado
      queryClient.invalidateQueries({
        queryKey: [CATEGORIAS_QUERY_KEY, 'detail', variables.id],
      });
    },
  });
};

// --- 5. DELETE /api/v1/categorias/{id} ---
const deleteCategoria = async (id: number): Promise<ApiResponse<void>> => {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/api/v1/categorias/${id}`,
  );
  return data;
};

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
    },
  });
};
