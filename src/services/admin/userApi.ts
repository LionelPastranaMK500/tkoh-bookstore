// src/services/admin/userApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '../types/ApiResponse';
import type { Page } from '../types/Page';
import type { UsuarioDto } from '../types/simple/UsuarioDto';
import type { UsuarioCreateDto } from '@/services/types/create/UsuarioCreateSchema';
import type { UsuarioUpdateDto } from '../types/update/UsuarioUpdateDto';
import type { User } from '../types/User';
// --- NUEVO: Importar RoleDto ---
import type { RoleDto } from '../types/role';
import type { AdminPasswordChangeDto } from '../types/update/adminPasswordChangeSchema';

const USERS_QUERY_KEY = ['adminUsers'];
// --- NUEVO: Query Key para Roles ---
const ROLES_QUERY_KEY = ['adminRoles'];

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
  // ... (código existente)
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

// --- GET BY ID (Sin cambios) ---
const fetchUserById = async (userId: number): Promise<ApiResponse<User>> => {
  // ... (código existente)
  const { data } = await apiClient.get<ApiResponse<User>>(
    `/api/v1/admin/users/${userId}`,
  );
  return data;
};

export const useUser = (userId: number) => {
  // ... (código existente)
  return useQuery({
    queryKey: [USERS_QUERY_KEY, userId], // Key única para este usuario
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, // Solo ejecuta la query si el userId es válido
  });
};

// --- UPDATE (Sin cambios) ---
const updateUser = async (
  updateData: UsuarioUpdateDto,
): Promise<ApiResponse<UsuarioDto>> => {
  // ... (código existente)
  const { data } = await apiClient.put<ApiResponse<UsuarioDto>>(
    `/api/v1/admin/users/${updateData.id}`,
    updateData,
  );
  return data;
};

export const useUpdateUser = () => {
  // ... (código existente)
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

// --- DELETE (Sin cambios) ---
const deleteUser = async (userId: number): Promise<ApiResponse<void>> => {
  // ... (código existente)
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/api/v1/admin/users/${userId}`,
  );
  return data;
};

export const useDeleteUser = () => {
  // ... (código existente)
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

// --- ADMIN UPDATE PASSWORD (Sin cambios) ---
interface AdminUpdatePasswordParams {
  userId: number;
  dto: AdminPasswordChangeDto;
}

const adminUpdatePassword = async ({
  userId,
  dto,
}: AdminUpdatePasswordParams): Promise<ApiResponse<void>> => {
  // ... (código existente)
  const { data } = await apiClient.put<ApiResponse<void>>(
    `/api/v1/admin/users/${userId}/password`,
    dto,
  );
  return data;
};

export const useAdminUpdatePassword = () => {
  // ... (código existente)
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

// --- (NUEVO) GET ALL ROLES ---
// Endpoint: GET /api/v1/roles
const fetchRoles = async (): Promise<ApiResponse<Page<RoleDto>>> => {
  // Pedimos hasta 100 roles; en la práctica solo son 4, así que traerá todos.
  const { data } = await apiClient.get<ApiResponse<Page<RoleDto>>>(
    '/api/v1/roles?page=0&size=100&sort=id,asc',
  );
  return data;
};

/**
 * Hook para obtener la lista de todos los roles disponibles en el sistema.
 */
export const useRoles = () => {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: fetchRoles,
    staleTime: 1000 * 60 * 5, // Cachear por 5 minutos
  });
};

// --- (NUEVO) ASSIGN ROLES TO USER ---
// Endpoint: PUT /api/v1/admin/users/{userId}/roles
interface AssignRolesParams {
  userId: number;
  roleIds: number[];
}

const assignRolesToUser = async ({
  userId,
  roleIds,
}: AssignRolesParams): Promise<ApiResponse<UsuarioDto>> => {
  const { data } = await apiClient.put<ApiResponse<UsuarioDto>>(
    `/api/v1/admin/users/${userId}/roles`,
    roleIds,
  );
  return data;
};

/**
 * Hook de mutación para asignar o actualizar los roles de un usuario.
 */
export const useAssignUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRolesToUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY, data.data.id],
      });
      console.log('Roles actualizados para:', data.data.nombreUsuario);
    },
    onError: (error) => {
      console.error('Error al asignar roles:', error);
    },
  });
};
