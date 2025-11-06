// src/services/types/conversacion/ConversacionCreateSchema.ts
import { z } from 'zod';

// Basado en ConversacionCreateDto.java
export const conversacionCreateSchema = z.object({
  asunto: z
    .string()
    .max(255, 'El asunto no puede exceder los 255 caracteres.')
    .optional()
    .or(z.literal('')),
  participanteIds: z
    .array(z.coerce.number())
    .min(1, 'Debe seleccionar al menos un destinatario.'),
});

export type ConversacionCreateFormValues = z.infer<
  typeof conversacionCreateSchema
>;
