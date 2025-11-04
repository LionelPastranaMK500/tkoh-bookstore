import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ResetPasswordForm } from '@/modules/auth/components/ResetPasswordForm';
import type { ResetPasswordFormValues } from '@/services/types/auth/ResetPasswordSchema';
import { useAuthStore } from '@/services/auth/authStore';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleResetSubmit = async (data: ResetPasswordFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await resetPassword(data);

      if (response.success) {
        toast.success(response.message || '¡Contraseña actualizada con éxito!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message || 'Ocurrió un error.');
      }
    } catch (err: any) {
      console.error('Error en reset-password:', err);
      const apiError =
        err.response?.data?.message ||
        err.message ||
        'No se pudo conectar al servidor.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <ResetPasswordForm
        onSubmit={handleResetSubmit}
        isLoading={isLoading}
        error={error}
        defaultEmail={emailFromUrl}
      />
    </div>
  );
};
