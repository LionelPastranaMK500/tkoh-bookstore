import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import type { RegisterFormValues } from '@/services/types/auth/RegisterSchema';
import { registerSchema } from '@/services/types/auth/RegisterSchema';
import type { RegisterFormProps } from '@/services/types/auth/RegisterFormProps';

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombreUsuario: '',
      email: '',
      celular: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Crear una cuenta</CardTitle>
        <CardDescription>
          Ingresa tus datos para registrarte en la plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre de Usuario */}
          <div>
            <Label htmlFor="nombreUsuario">Nombre de Usuario</Label>
            <Input
              id="nombreUsuario"
              {...register('nombreUsuario')}
              aria-invalid={errors.nombreUsuario ? 'true' : 'false'}
              disabled={isLoading}
            />
            {errors.nombreUsuario && (
              <p className="text-destructive text-sm mt-1">
                {errors.nombreUsuario.message}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Celular (Opcional) */}
          <div>
            <Label htmlFor="celular">Celular </Label>
            <Input
              id="celular"
              placeholder="Ej: 987654321"
              {...register('celular')}
              aria-invalid={errors.celular ? 'true' : 'false'}
              disabled={isLoading}
            />
            {errors.celular && (
              <p className="text-destructive text-sm mt-1">
                {errors.celular.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Contraseña</Label>
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

          {/* Confirmar Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
