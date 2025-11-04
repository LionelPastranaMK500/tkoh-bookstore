import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '../types/ApiResponse';
import type { Page } from '../types/Page';
import type { UsuarioDto } from '../types/simple/UsuarioDto';
import type { UsuarioCreateDto } from '@/services/types/create/UsuarioCreateSchema';
import type { UsuarioUpdateDto } from '../types/update/UsuarioUpdateDto';
import type { User } from '../types/User';
// --- NUEVO: Importar la interfaz del DTO ---
import type { AdminPasswordChangeDto } from '../types/update/adminPasswordChangeSchema';

const USERS_QUERY_KEY = ['adminUsers'];

// --- GET ALL (Sin cambios) ---
const fetchUsers = async (): Promise<ApiResponse<Page<UsuarioDto>>> => {
  const { data } = await apiClient.get<ApiResponse<Page<UsuarioDto>>>(
    '/api/v1/admin/users',
  );
  return data;
};

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
  });
};

// --- CREATE (Sin cambios) ---
const createUser = async (formData: UsuarioCreateDto & { role: string }) => {
  const { role, ...apiData } = formData;
  let endpoint = '';
  switch (role) {
    case 'OWNER':
      endpoint = '/api/v1/admin/users/owner';
      break;
    case 'ADMIN':
      endpoint = '/api/v1/admin/users/admin';
      break;
    case 'VENDEDOR':
      endpoint = '/api/v1/admin/users/vendedor';
      break;
    case 'USUARIO':
      endpoint = '/api/v1/admin/users/usuario';
      break;
    default:
      throw new Error('Rol no válido seleccionado');
  }
  const { data } = await apiClient.post<ApiResponse<UsuarioDto>>(
    endpoint,
    apiData,
  );
  return data;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      console.log('Usuario creado:', data.data.nombreUsuario);
    },
    onError: (error) => {
      console.error('Error al crear usuario:', error);
    },
  });
};

// --- (NUEVO) GET BY ID ---
// Endpoint: GET /api/v1/admin/users/{userId}
const fetchUserById = async (userId: number): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.get<ApiResponse<User>>(
    `/api/v1/admin/users/${userId}`,
  );
  return data;
};

/**
 * Hook para obtener los detalles de un solo usuario (Usa UsuarioDetailDto, que es tu tipo 'User')
 */
export const useUser = (userId: number) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, userId], // Key única para este usuario
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, // Solo ejecuta la query si el userId es válido
  });
};

// --- (NUEVO) UPDATE ---
// Endpoint: PUT /api/v1/admin/users/{userId}
const updateUser = async (
  updateData: UsuarioUpdateDto,
): Promise<ApiResponse<UsuarioDto>> => {
  const { data } = await apiClient.put<ApiResponse<UsuarioDto>>(
    `/api/v1/admin/users/${updateData.id}`,
    updateData,
  );
  return data;
};

/**
 * Hook de mutación para actualizar un usuario.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // Refresca la lista completa de usuarios
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      // Refresca también el detalle de este usuario, si está cacheado
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY, data.data.id],
      });
      console.log('Usuario actualizado:', data.data.nombreUsuario);
    },
    onError: (error) => {
      console.error('Error al actualizar usuario:', error);
    },
  });
};

// --- (NUEVO) DELETE ---
// Endpoint: DELETE /api/v1/admin/users/{userId}
const deleteUser = async (userId: number): Promise<ApiResponse<void>> => {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/api/v1/admin/users/${userId}`,
  );
  return data;
};

/**
 * Hook de mutación para eliminar un usuario.
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      console.log('Usuario eliminado');
    },
    onError: (error) => {
      console.error('Error al eliminar usuario:', error);
    },
  });
};

interface AdminUpdatePasswordParams {
  userId: number;
  dto: AdminPasswordChangeDto;
}

const adminUpdatePassword = async ({
  userId,
  dto,
}: AdminUpdatePasswordParams): Promise<ApiResponse<void>> => {
  const { data } = await apiClient.put<ApiResponse<void>>(
    `/api/v1/admin/users/${userId}/password`,
    dto,
  );
  return data;
};

/**
 * Hook de mutación para que un admin cambie la contraseña de un usuario.
 */
export const useAdminUpdatePassword = () => {
  return useMutation({
    mutationFn: adminUpdatePassword,
    onSuccess: () => {
      console.log('Contraseña de usuario actualizada por admin');
    },
    onError: (error) => {
      console.error('Error al actualizar contraseña de usuario:', error);
    },
  });
};
