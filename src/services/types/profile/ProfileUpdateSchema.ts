// src/services/types/profile/ProfileUpdateSchema.ts
import { z } from 'zod';

// Valida solo los campos que el usuario puede actualizar de sí mismo
export const profileUpdateSchema = z.object({
  nombreUsuario: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  celular: z
    .string()
    .regex(
      /^(\+51)?[9]\d{8}$/,
      'Debe ser un número peruano válido (ej: 987654321)',
    )
    .optional()
    .or(z.literal('')), // Acepta opcional o string vacío
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

// Este es el DTO que espera la API (PUT /api/v1/users/me)
// La API es inteligente y solo toma nombreUsuario y celular
export type ProfileUpdateDto = ProfileUpdateFormValues;
