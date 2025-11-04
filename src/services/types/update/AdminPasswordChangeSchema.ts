import { z } from 'zod';

// 1. Este es el DTO que espera la API
// Coincide con PasswordChangeDto.java
export interface AdminPasswordChangeDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// 2. Este es el Schema de Zod para validar el formulario
export const adminPasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'], // Dónde mostrar el error
  });

// 3. Este es el tipo inferido para el formulario de React Hook Form
export type AdminPasswordChangeFormValues = z.infer<
  typeof adminPasswordChangeSchema
>;
