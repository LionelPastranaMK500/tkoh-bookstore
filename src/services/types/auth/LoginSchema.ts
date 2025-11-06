// src/services/types/auth/LoginSchema.ts
import { z } from 'zod';

// Esquema de validación Zod
export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

// Inferir el tipo de los valores del formulario
export type LoginFormValues = z.infer<typeof loginSchema>;
