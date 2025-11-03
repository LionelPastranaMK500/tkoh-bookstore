// src/modules/auth/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ForgotPasswordForm,
  type ForgotPasswordFormValues,
} from '@/modules/auth/components/ForgotPasswordForm';
import apiClient from '@/services/api';
import { toast } from 'react-toastify';
import { z } from 'zod';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotSubmit = async (data: ForgotPasswordFormValues) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post(
        '/api/v1/auth/forgot-password',
        data,
      );

      if (response.data.success) {
        setSuccessMessage(
          response.data.message ||
            'Solicitud procesada. Si los datos son correctos, recibirás un SMS.',
        );
        toast.success('Solicitud enviada. Revisa tus mensajes SMS.');
        // Extraer el email si el identificador era un email
        const email = z.string().email().safeParse(data.identificador).success
          ? data.identificador
          : '';

        // Redirigir a la página de reseteo, pasando el email si lo tenemos
        setTimeout(() => {
          navigate(
            `/?view=reset${email ? `&email=${encodeURIComponent(email)}` : ''}`,
          );
        }, 3000);
      } else {
        setError(response.data.message || 'Ocurrió un error.');
      }
    } catch (err: any) {
      console.error('Error en forgot-password:', err);
      // La API siempre devuelve 200 OK en este endpoint por seguridad,
      // pero manejamos errores de red o 500
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
