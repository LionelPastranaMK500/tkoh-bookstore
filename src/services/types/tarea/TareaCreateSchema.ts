// src/services/types/tarea/TareaCreateSchema.ts
import { z } from 'zod';

export const tareaCreateSchema = z.object({
  usuarioAsignadoId: z.coerce.number().min(1, 'Debe seleccionar un usuario.'),
  descripcion: z
    .string()
    .min(1, 'La descripción no puede estar vacía.')
    .max(255, 'La descripción no puede exceder los 255 caracteres.'),
  fechaLimite: z.string().optional().or(z.literal('')), // Acepta string vacío
});

export type TareaCreateFormValues = z.infer<typeof tareaCreateSchema>;
