// src/services/types/auth/RegisterSchema.ts
import { z } from 'zod';

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
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
