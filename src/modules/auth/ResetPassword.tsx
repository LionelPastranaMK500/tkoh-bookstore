import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ResetPasswordForm,
  type ResetPasswordFormValues,
} from '@/modules/auth/components/ResetPasswordForm';
import apiClient from '@/services/api';
import { toast } from 'react-toastify';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetSubmit = async (data: ResetPasswordFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      // El DTO de la API espera { email, otp, newPassword, confirmPassword }
      const response = await apiClient.post(
        '/api/v1/auth/reset-password',
        data,
      );

      if (response.data.success) {
        toast.success(
          response.data.message || '¡Contraseña actualizada con éxito!',
        );
        // Redirigir al login
        setTimeout(() => {
          navigate('/?view=login');
        }, 3000);
      } else {
        setError(response.data.message || 'Ocurrió un error.');
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
