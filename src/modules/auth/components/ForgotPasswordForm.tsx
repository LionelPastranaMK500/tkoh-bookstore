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
import type { ForgotPasswordFormValues } from '@/services/types/auth/ForgotPasswordSchema';
import { forgotPasswordSchema } from '@/services/types/auth/ForgotPasswordSchema';
import type { ForgotPasswordFormProps } from '@/services/types/auth/ForgotPasswordFormProps';

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  isLoading,
  error,
  successMessage,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identificador: '',
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
        <CardDescription>
          Ingresa tu celular asociado a tu cuenta. Te enviaremos un código de
          recuperación por SMS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage ? (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="identificador">Celular (+51)</Label>
              <Input
                id="identificador"
                placeholder="Ej: 987654321"
                {...register('identificador')}
                aria-invalid={errors.identificador ? 'true' : 'false'}
                disabled={isLoading}
              />
              {errors.identificador && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.identificador.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Enviando...' : 'Enviar Código'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
