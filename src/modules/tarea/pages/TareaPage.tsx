// src/modules/tarea/pages/TareaPage.tsx
import { useMemo } from 'react';
import { TareaTable } from '../components/TareaTable';
import { useAuthStore } from '@/services/auth/authStore';

export const TareaPage = () => {
  const user = useAuthStore((state) => state.user);
  const userRoles = user?.roles || [];

  const canReadAll = useMemo(
    () =>
      userRoles.some((r) => r.nombreRol === 'OWNER' || r.nombreRol === 'ADMIN'),
    [userRoles],
  );

  const scope = canReadAll ? 'all' : 'me';

  return (
    <div className="container mx-auto py-8">
      <TareaTable scope={scope} />
    </div>
  );
};
