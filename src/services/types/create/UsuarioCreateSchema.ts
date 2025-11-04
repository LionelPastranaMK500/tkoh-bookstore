import { z } from 'zod';

const ROLES = ['OWNER', 'ADMIN', 'VENDEDOR', 'USUARIO'] as const;

export const usuarioCreateSchema = z.object({
  nombreUsuario: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.email('Correo electrónico inválido'),
  celular: z
    .string()
    .regex(
      /^(\+51)?[9]\d{8}$/,
      'Debe ser un número peruano válido (ej: 987654321)',
    )
    .optional()
    .or(z.literal('')),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.enum(ROLES),
});

/**
 * Tipo inferido del formulario
 */
export type UsuarioCreateFormValues = z.infer<typeof usuarioCreateSchema>;

export type UsuarioCreateDto = Omit<UsuarioCreateFormValues, 'role'>;
