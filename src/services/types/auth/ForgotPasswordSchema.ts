// src/services/types/auth/ForgotPasswordSchema.ts
import { z } from 'zod';

// Esquema de validación (SOLO CELULAR, como acordamos)
export const forgotPasswordSchema = z.object({
  identificador: z
    .string()
    .min(1, 'El campo es requerido')
    .regex(
      /^(\+51)?[9]\d{8}$/,
      'Debe ser un celular peruano válido (ej: 987654321 o +51987654321)',
    ),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
