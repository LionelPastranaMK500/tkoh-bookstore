// src/services/types/auth/RegisterFormProps.ts
import type { RegisterFormValues } from './RegisterSchema';

// Props que el componente de UI espera
export interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => Promise<void>; // Lo hacemos async
  isLoading: boolean;
  error: string | null;
}
