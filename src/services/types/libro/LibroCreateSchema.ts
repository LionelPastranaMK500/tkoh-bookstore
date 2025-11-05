// src/services/types/libro/LibroCreateSchema.ts
import { z } from 'zod';

export const libroCreateSchema = z.object({
  isbn: z
    .string()
    .min(1, 'El ISBN es obligatorio.')
    .max(50, 'El ISBN no puede exceder los 50 caracteres.'),
  titulo: z
    .string()
    .min(1, 'El título es obligatorio.')
    .max(255, 'El título no puede exceder los 255 caracteres.'),
  autor: z
    .string()
    .max(150, 'El autor no puede exceder los 150 caracteres.')
    .optional()
    .or(z.literal('')),
  fechaPublicacion: z
    .string()
    .min(1, 'La fecha de publicación es obligatoria.'),
  categoriaId: z.coerce.number().min(1, 'Debe seleccionar una categoría.'),
  editorialId: z.coerce.number().min(1, 'Debe seleccionar una editorial.'),
});

export type LibroCreateFormValues = z.infer<typeof libroCreateSchema>;
