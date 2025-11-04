// src/services/types/auth/ResetPasswordFormProps.ts
import type { ResetPasswordFormValues } from './ResetPasswordSchema';

export interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormValues) => void;
  isLoading: boolean;
  error: string | null;
  defaultEmail: string;
}
