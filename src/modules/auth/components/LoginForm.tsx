// src/modules/auth/components/LoginForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Link } from 'react-router-dom'; // <-- 1. Importar Link

// Importar los tipos
import type { LoginFormValues } from '@/services/types/auth/LoginSchema';
import { loginSchema } from '@/services/types/auth/LoginSchema';
import type { LoginFormProps } from '@/services/types/auth/LoginFormProps';

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error, // Dejamos esto como lo tienes, ya que confirmaste que funciona
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data: LoginFormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Campo Email */}
      <div>
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-destructive text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div>
        {/* --- 2. ENLACE AÑADIDO (FORGOT PASSWORD) --- */}
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        {/* --- FIN DEL ENLACE --- */}
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-destructive text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Botón de Envío */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* --- 3. ENLACE AÑADIDO (REGISTRO) --- */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{' '}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline"
        >
          Regístrate
        </Link>
      </p>
      {/* --- FIN DEL ENLACE --- */}
    </form>
  );
};
