// src/services/types/conversacion/MensajeCreateSchema.ts
import { z } from 'zod';

// Basado en MensajeCreateDto.java
export const mensajeCreateSchema = z.object({
  cuerpoMensaje: z.string().min(1, 'El mensaje no puede estar vacío.'),
});

export type MensajeCreateFormValues = z.infer<typeof mensajeCreateSchema>;
