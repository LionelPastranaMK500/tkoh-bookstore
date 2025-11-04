// src/services/types/auth/ResetPasswordCredentials.ts
import type { ResetPasswordFormValues } from './ResetPasswordSchema';

/**
 * Credenciales para confirmar el reseteo de contraseña.
 * (Basado en PasswordResetRequest.java)
 */
export type ResetPasswordCredentials = ResetPasswordFormValues;
