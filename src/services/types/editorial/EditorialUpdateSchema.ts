// src/services/types/editorial/EditorialUpdateSchema.ts
import { z } from 'zod';

export const editorialUpdateSchema = z.object({
  id: z.number(),
  nombre: z
    .string()
    .min(1, 'El nombre no puede estar vacío.')
    .max(100, 'El nombre no puede exceder los 100 caracteres.'),
});

export type EditorialUpdateFormValues = z.infer<typeof editorialUpdateSchema>;
