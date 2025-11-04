// src/services/types/auth/RegisterCredentials.ts
import type { RegisterFormValues } from './RegisterSchema';

/**
 * Credenciales para el registro.
 * (Es RegisterFormValues pero sin 'confirmPassword')
 */
export type RegisterCredentials = Omit<RegisterFormValues, 'confirmPassword'>;
