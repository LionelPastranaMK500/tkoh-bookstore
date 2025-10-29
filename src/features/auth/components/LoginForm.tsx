import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button'; // Ruta corregida
import { Input } from '@/shared/ui/input'; // Ruta corregida
import { Label } from '@/shared/ui/label'; // Ruta corregida

// Imports para la lógica de API
import apiClient from '@/shared/api/axiosInstance';
import { useAuthStore } from '@/features/auth/model/authStore';

// 1. Definir el esquema de validación con Zod (Sintaxis moderna)
const loginSchema = z.object({
  email: z.email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

// 2. Inferir el tipo del formulario desde el esquema de Zod
type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  // 3. Configurar el hook useForm con el resolver de Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Hooks para el estado y el error de API
  const storeLogin = useAuthStore((state) => state.login);
  const [apiError, setApiError] = React.useState<string | null>(null);

  // 4. Definir la función de envío (¡AHORA HACE LA LLAMADA A LA API!)
  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null); // Limpiar error anterior
    try {
      // 1. Llamar a la API aquí
      const response = await apiClient.post('/auth/login', data);

      // 2. Pasar los datos (usuario y tokens) al store para guardarlos
      storeLogin(response.data);

      // 3. Opcional: Redirigir al usuario
      // window.location.href = '/dashboard';
      console.log('¡Inicio de sesión exitoso!', response.data);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      // 4. Mostrar un error genérico al usuario
      setApiError('Email o contraseña incorrectos. Intente de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Mostrar error de API si existe */}
      {apiError && (
        <div className="text-red-600 text-sm font-medium p-3 bg-red-100 border border-red-300 rounded-md">
          {apiError}
        </div>
      )}

      <div>
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};
