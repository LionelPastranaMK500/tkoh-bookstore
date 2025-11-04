import { z } from 'zod';

// Este es el schema para el formulario de *edición*.
// No incluye 'password' y hace 'celular' opcional.
export const usuarioUpdateSchema = z.object({
  id: z.number(), // Necesario para saber a quién actualizar
  nombreUsuario: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  celular: z
    .string()
    .regex(
      /^(\+51)?[9]\d{8}$/,
      'Debe ser un número peruano válido (ej: 987654321)',
    )
    .optional()
    .or(z.literal('')), // Acepta opcional o string vacío
  enabled: z.boolean().default(true),
  accountNonLocked: z.boolean().default(true),
  // No incluimos 'roleIds' aquí; es mejor manejarlo en un modal separado.
});

/**
 * Tipo inferido del formulario de actualización
 */
export type UsuarioUpdateFormValues = z.infer<typeof usuarioUpdateSchema>;
