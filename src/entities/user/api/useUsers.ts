// src/entities/user/api/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api'; // Su instancia de Axiosconfigurada
import type { User } from '@/features/auth/model/types';
const fetchUsers = async (): Promise<User> => {
  const { data } = await apiClient.get('/users');
  return data;
};
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'], // Clave de caché única
    queryFn: fetchUsers,
  });
};
