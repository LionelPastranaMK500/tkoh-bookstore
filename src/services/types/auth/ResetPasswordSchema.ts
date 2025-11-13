// src/services/types/auth/ResetPasswordSchema.ts
import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    email: z.string().email('Debe ser un email válido'),
    otp: z
      .string()
      .length(6, 'El código OTP debe tener 6 dígitos')
      .regex(/^\d{6}$/, 'El código debe ser numérico'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
