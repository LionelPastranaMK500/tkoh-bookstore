// src/services/types/categoria/CategoriaCreateSchema.ts
import { z } from 'zod';

// Basado en CategoriaCreateDto.java
export const categoriaCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre no puede estar vacío.')
    .max(100, 'El nombre no puede exceder los 100 caracteres.'),
});

export type CategoriaCreateFormValues = z.infer<typeof categoriaCreateSchema>;
