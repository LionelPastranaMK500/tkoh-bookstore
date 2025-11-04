// src/services/types/auth/LoginFormProps.ts
import type { LoginFormValues } from './LoginSchema';

/**
 * Define las props que espera el componente LoginForm
 */
export interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
