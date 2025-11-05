// src/services/editorialApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '@/services/types/ApiResponse';
import type { Page } from '@/services/types/Page';
import type { EditorialDto } from '@/services/types/simple/EditorialDto';
import type { EditorialDetailDto } from '@/services/types/detail/EditorialDetailDto';
import type { EditorialCreateFormValues } from '@/services/types/editorial/EditorialCreateSchema';
import type { EditorialUpdateFormValues } from '@/services/types/editorial/EditorialUpdateSchema';

const EDITORIALES_QUERY_KEY = ['editoriales'];

// --- 1. GET /api/v1/editoriales (Paginado) ---
const fetchEditoriales = async (
  pageable: { page: number; size: number } = { page: 0, size: 10 },
): Promise<ApiResponse<Page<EditorialDto>>> => {
  const { data } = await apiClient.get<ApiResponse<Page<EditorialDto>>>(
    `/api/v1/editoriales?page=${pageable.page}&size=${pageable.size}&sort=id,asc`,
  );
  return data;
};

export const useEditoriales = (
  pageable: { page: number; size: number } = { page: 0, size: 10 },
) => {
  return useQuery({
    queryKey: [EDITORIALES_QUERY_KEY, pageable],
    queryFn: () => fetchEditoriales(pageable),
    refetchOnWindowFocus: false,
  });
};

// --- 2. GET /api/v1/editoriales/{id} ---
const fetchEditorialDetail = async (
  id: number,
): Promise<ApiResponse<EditorialDetailDto>> => {
  const { data } = await apiClient.get<ApiResponse<EditorialDetailDto>>(
    `/api/v1/editoriales/${id}`,
  );
  return data;
};

export const useEditorialDetail = (id: number) => {
  return useQuery({
    queryKey: [EDITORIALES_QUERY_KEY, 'detail', id],
    queryFn: () => fetchEditorialDetail(id),
    enabled: !!id,
  });
};

// --- 3. POST /api/v1/editoriales ---
const createEditorial = async (
  editorialData: EditorialCreateFormValues,
): Promise<ApiResponse<EditorialDto>> => {
  const { data } = await apiClient.post<ApiResponse<EditorialDto>>(
    '/api/v1/editoriales',
    editorialData,
  );
  return data;
};

export const useCreateEditorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEditorial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDITORIALES_QUERY_KEY });
    },
  });
};

// --- 4. PUT /api/v1/editoriales/{id} ---
const updateEditorial = async (
  editorialData: EditorialUpdateFormValues,
): Promise<ApiResponse<EditorialDto>> => {
  const { data } = await apiClient.put<ApiResponse<EditorialDto>>(
    `/api/v1/editoriales/${editorialData.id}`,
    editorialData,
  );
  return data;
};

export const useUpdateEditorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEditorial,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EDITORIALES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [EDITORIALES_QUERY_KEY, 'detail', variables.id],
      });
    },
  });
};

// --- 5. DELETE /api/v1/editoriales/{id} ---
const deleteEditorial = async (id: number): Promise<ApiResponse<void>> => {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/api/v1/editoriales/${id}`,
  );
  return data;
};

export const useDeleteEditorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEditorial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDITORIALES_QUERY_KEY });
    },
  });
};
