// src/shared/hooks/usePermission.ts
import { useAuthStore } from '@/features/auth/model/authStore';

// 1. Corregimos el tipo de 'requiredPermissions' de string a string[]
export const usePermission = (requiredPermissions: string[]): boolean => {
  const { user } = useAuthStore.getState();

  // 2. Corregimos el error de sintaxis y el tipo
  // Asumimos que user.permissions es un string[]
  // Damos un array vacío '[]' como fallback si no existe
  const userPermissions = user?.permissions || [];

  // 3. Ahora 'every' funciona porque 'requiredPermissions' es un array
  // Y 'p' se infiere correctamente como 'string'
  return requiredPermissions.every((p) => userPermissions.includes(p));
};
