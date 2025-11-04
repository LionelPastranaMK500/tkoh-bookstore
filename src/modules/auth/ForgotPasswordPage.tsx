// src/modules/auth/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ForgotPasswordFormValues } from '@/services/types/auth/ForgotPasswordSchema';
import { ForgotPasswordForm } from '@/modules/auth/components/ForgotPasswordForm';
import { useAuthStore } from '@/services/auth/authStore';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const handleForgotSubmit = async (data: ForgotPasswordFormValues) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await forgotPassword(data);
      if (response.success) {
        setSuccessMessage(
          response.message ||
            'Solicitud procesada. Si los datos son correctos, recibirás un SMS.',
        );
        toast.success('Solicitud enviada. Revisa tus mensajes SMS.');
        setTimeout(() => {
          navigate('/?view=reset');
        }, 3000);
      } else {
        setError(response.message || 'Ocurrió un error.');
      }
    } catch (err: any) {
      console.error('Error en forgot-password:', err);
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
      <ForgotPasswordForm
        onSubmit={handleForgotSubmit}
        isLoading={isLoading}
        error={error}
        successMessage={successMessage}
      />
    </div>
  );
};
