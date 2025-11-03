import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@//shared/ui/button';
import { Input } from '@//shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

// Esquema de validación para el registro
export const registerSchema = z
  .object({
    nombreUsuario: z
      .string()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    email: z.email('Correo electrónico inválido'),
    celular: z
      .string()
      .regex(
        /^(\+51)?[9]\d{8}$/,
        'Debe ser un número peruano válido (ej: 987654321 o +51987654321)',
      )
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // Error se mostrará en el campo de confirmar contraseña
  });

// Tipo inferido del esquema
export type RegisterFormValues = z.infer<typeof registerSchema>;

// Props que el componente de UI espera
interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => void;
  isLoading: boolean;
  error: string | null;
}

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
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
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
              <p className="text-red-500 text-sm mt-1">
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
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Celular (Opcional) */}
          <div>
            <Label htmlFor="celular">Celular (Opcional)</Label>
            <Input
              id="celular"
              placeholder="Ej: 987654321"
              {...register('celular')}
              aria-invalid={errors.celular ? 'true' : 'false'}
              disabled={isLoading}
            />
            {errors.celular && (
              <p className="text-red-500 text-sm mt-1">
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
              <p className="text-red-500 text-sm mt-1">
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
              <p className="text-red-500 text-sm mt-1">
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
