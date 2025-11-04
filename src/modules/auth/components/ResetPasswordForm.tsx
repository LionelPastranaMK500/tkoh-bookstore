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
import type { ResetPasswordFormValues } from '@/services/types/auth/ResetPasswordSchema';
import { resetPasswordSchema } from '@/services/types/auth/ResetPasswordSchema';
import type { ResetPasswordFormProps } from '@/services/types/auth/ResetPasswordFormProps';

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  isLoading,
  error,
  defaultEmail,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: defaultEmail || '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Restablecer Contraseña</CardTitle>
        <CardDescription>
          Ingresa tu email, el código OTP que recibiste por SMS y tu nueva
          contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              disabled={isLoading || !!defaultEmail} // Deshabilitar si vino de la URL
              readOnly={!!defaultEmail}
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* OTP */}
          <div>
            <Label htmlFor="otp">Código OTP</Label>
            <Input
              id="otp"
              placeholder="123456"
              {...register('otp')}
              aria-invalid={errors.otp ? 'true' : 'false'}
              disabled={isLoading}
            />
            {errors.otp && (
              <p className="text-destructive text-sm mt-1">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              aria-invalid={errors.newPassword ? 'true' : 'false'}
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-destructive text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
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
            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
