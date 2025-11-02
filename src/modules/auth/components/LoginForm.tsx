import React from 'react'; // Necesario para React.FC
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Ajusta las rutas según tu estructura final y donde pusiste los componentes UI
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

// Esquema de validación Zod (sin cambios)
const loginSchema = z.object({
  email: z.email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

// Inferir el tipo de los valores del formulario
type LoginFormValues = z.infer<typeof loginSchema>;

// *** INTERFAZ PARA LAS PROPS ***
// Definimos qué props espera este componente desde LoginPage
interface LoginFormProps {
  onLoginSubmit: (credentials: LoginFormValues) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  onSuccess: () => void;
  isLoading: boolean;
}

// *** COMPONENTE ACTUALIZADO ***
// Acepta las props definidas en LoginFormProps
export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSubmit,
  setLoading,
  setError,
  onSuccess,
  isLoading,
}) => {
  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // *** FUNCIÓN onSubmit ACTUALIZADA ***
  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    setLoading(true);
    try {
      // Llama a la función que vino de LoginPage
      await onLoginSubmit(data);
      // Si tuvo éxito, llama al callback de éxito
      onSuccess();
    } catch (error: any) {
      // Si hubo error, llama al callback de error
      console.error('Login failed in LoginForm:', error);
      const errorMessage =
        error?.response?.data?.message ||
        (error?.message?.includes('401') ? 'Credenciales inválidas.' : null) ||
        (error?.message?.includes('Network Error') ||
        error?.message?.includes('Failed to fetch')
          ? 'No se pudo conectar al servidor.'
          : null) ||
        error?.message ||
        'Ocurrió un error inesperado.';
      setError(errorMessage);
      setLoading(false); // Importante: Parar la carga en caso de error
    }
  };

  // --- Renderizado del formulario ---
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Campo Email */}
      <div>
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Botón de Envío */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};
