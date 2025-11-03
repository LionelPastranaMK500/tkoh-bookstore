import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RegisterForm,
  type RegisterFormValues,
} from '@/modules/auth/components/RegisterForm';
import apiClient from '@/services/api'; // Asegúrate que la ruta a tu 'apiClient' (axios) sea correcta
import { toast } from 'react-toastify';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (data: RegisterFormValues) => {
    setError(null);
    setIsLoading(true);

    // Excluir confirmPassword del objeto a enviar
    const { confirmPassword, ...apiData } = data;

    try {
      // Llamar al endpoint de registro de la API
      // (Asumiendo que tu apiClient está configurado para manejar ApiResponse)
      const response = await apiClient.post('/api/v1/auth/register', apiData);

      if (response.data.success) {
        toast.success(
          response.data.message ||
            '¡Registro exitoso! Ahora puedes iniciar sesión.',
        );
        // Redirigir al login (que ahora es /?view=login)
        navigate('/?view=login');
      } else {
        setError(
          response.data.message || 'Ocurrió un error durante el registro.',
        );
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
