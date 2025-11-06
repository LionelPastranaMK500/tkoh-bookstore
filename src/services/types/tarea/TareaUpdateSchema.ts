// src/services/types/tarea/TareaUpdateSchema.ts
import { z } from 'zod';

export const tareaUpdateSchema = z.object({
  id: z.number(),
  descripcion: z
    .string()
    .min(1, 'La descripción no puede estar vacía.')
    .max(255, 'La descripción no puede exceder los 255 caracteres.'),
  fechaLimite: z.string().optional().or(z.literal('')),
  completado: z.boolean(),
  usuarioAsignadoId: z.coerce.number().min(1, 'Debe seleccionar un usuario.'),
});

export type TareaUpdateFormValues = z.infer<typeof tareaUpdateSchema>;
