import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import type { RegisterFormValues } from '@/services/types/auth/RegisterSchema';
import { useAuthStore } from '@/services/auth/authStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const handleRegisterSubmit = async (data: RegisterFormValues) => {
    setError(null);
    setIsLoading(true);

    const { confirmPassword, ...apiData } = data;

    try {
      const response = await register(apiData);

      if (response.success) {
        toast.success(
          response.message || '¡Registro exitoso! Ahora puedes iniciar sesión.',
        );
        navigate('/login');
      } else {
        setError(response.message || 'Ocurrió un error durante el registro.');
      }
    } catch (err: any) {
      console.error('Error en el registro:', err);
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
      <RegisterForm
        onSubmit={handleRegisterSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};
