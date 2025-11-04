import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import type { ApiResponse } from '../types/ApiResponse';
import type { Page } from '../types/Page';
import type { UsuarioDto } from '../types/simple/UsuarioDto';
import type { UsuarioCreateDto } from '@/services/types/create/UsuarioCreateSchema';

const USERS_QUERY_KEY = ['adminUsers'];

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

// --- 2. FUNCIÓN DE CREAR (POST) (Nueva) ---
/**
 * Función que llama al endpoint de creación correcto
 * basado en el rol seleccionado en el formulario.
 */
const createUser = async (formData: UsuarioCreateDto & { role: string }) => {
  const { role, ...apiData } = formData; // Separamos 'role' del payload
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

/**
 * Hook de mutación para crear un nuevo usuario.
 */
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
