// src/services/types/auth/ForgotPasswordFormProps.ts
import type { ForgotPasswordFormValues } from './ForgotPasswordSchema';

/**
 * Define las props que espera el componente ForgotPasswordForm
 */
export interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormValues) => void;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}
