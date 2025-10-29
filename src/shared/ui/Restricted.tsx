// src/shared/ui/Restricted.tsx
import React from 'react';
import { usePermission } from '@/shared/hooks/usePermission';

interface RestrictedProps {
  to: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Restricted = ({
  to,
  fallback = null,
  children,
}: RestrictedProps) => {
  const isAllowed = usePermission(to); // 'to' ahora es un array, como espera el hook

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
