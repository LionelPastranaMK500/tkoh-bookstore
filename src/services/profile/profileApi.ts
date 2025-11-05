// src/services/profileApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api';
import { useAuthStore } from '@/services/auth/authStore';
import type { ApiResponse } from '@/services/types/ApiResponse';
import type { User } from '@/services/types/User';
import type { UsuarioDto } from '@/services/types/simple/UsuarioDto';
import type { ProfileUpdateDto } from '@/services/types/profile/ProfileUpdateSchema';
import type { PasswordChangeFormValues } from '@/services/types/profile/PasswordChangeSchema';

// Query Key para el perfil del usuario
const MY_PROFILE_QUERY_KEY = ['myProfile'];

// --- 1. GET /api/v1/users/me ---
const fetchMyProfile = async (): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.get<ApiResponse<User>>('/api/v1/users/me');
  return data;
};

/**
 * Hook para obtener los detalles del perfil del usuario autenticado.
 */
export const useMyProfile = () => {
  return useQuery({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: fetchMyProfile,
    refetchOnWindowFocus: true,
  });
};

// --- 2. PUT /api/v1/users/me ---
const updateMyProfile = async (
  profileData: ProfileUpdateDto,
): Promise<ApiResponse<UsuarioDto>> => {
  const { data } = await apiClient.put<ApiResponse<UsuarioDto>>(
    '/api/v1/users/me',
    profileData,
  );
  return data;
};

/**
 * Hook de mutación para actualizar el perfil del usuario.
 */
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
      useAuthStore.getState().fetchUser();
    },
  });
};

// --- 3. PUT /api/v1/users/me/password ---
const changeMyPassword = async (
  passwordData: PasswordChangeFormValues,
): Promise<ApiResponse<void>> => {
  const { data } = await apiClient.put<ApiResponse<void>>(
    '/api/v1/users/me/password',
    passwordData,
  );
  return data;
};

/**
 * Hook de mutación para que el usuario cambie su propia contraseña.
 */
export const useChangeMyPassword = () => {
  return useMutation({
    mutationFn: changeMyPassword,
  });
};
