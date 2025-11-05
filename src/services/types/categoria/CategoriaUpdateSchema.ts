// src/services/types/categoria/CategoriaUpdateSchema.ts
import { z } from 'zod';

// Basado en CategoriaUpdateDto.java
export const categoriaUpdateSchema = z.object({
  id: z.number(),
  nombre: z
    .string()
    .min(1, 'El nombre no puede estar vacío.')
    .max(100, 'El nombre no puede exceder los 100 caracteres.'),
});

export type CategoriaUpdateFormValues = z.infer<typeof categoriaUpdateSchema>;
