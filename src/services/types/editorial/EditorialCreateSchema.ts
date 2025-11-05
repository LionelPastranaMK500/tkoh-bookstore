// src/services/types/editorial/EditorialCreateSchema.ts
import { z } from 'zod';

export const editorialCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre no puede estar vacío.')
    .max(100, 'El nombre no puede exceder los 100 caracteres.'),
});

export type EditorialCreateFormValues = z.infer<typeof editorialCreateSchema>;
