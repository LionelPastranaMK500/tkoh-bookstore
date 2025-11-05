// src/services/types/profile/PasswordChangeSchema.ts
import { z } from 'zod';

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
  });

export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
