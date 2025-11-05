// src/services/types/libro/LibroUpdateSchema.ts
import { z } from 'zod';

// Basado en LibroUpdateDto.java
export const libroUpdateSchema = z.object({
  isbn: z.string(), // El ISBN no es editable, pero se incluye
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

export type LibroUpdateFormValues = z.infer<typeof libroUpdateSchema>;
