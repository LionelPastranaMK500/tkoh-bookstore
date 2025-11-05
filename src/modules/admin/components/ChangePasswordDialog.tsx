import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useAdminUpdatePassword } from '@/services/admin/userApi';
import type { UsuarioDto } from '@/services/types/simple/UsuarioDto';
import {
  adminPasswordChangeSchema,
  type AdminPasswordChangeFormValues,
} from '@/services/types/update/AdminPasswordChangeSchema';

// Importar componentes de Shadcn/UI
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Loader2 } from 'lucide-react';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UsuarioDto | null; // El usuario al que se le cambiará la contraseña
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onOpenChange,
  user,
}) => {
  const { mutate: updatePassword, isPending: isUpdating } =
    useAdminUpdatePassword();

  const form = useForm<AdminPasswordChangeFormValues>({
    resolver: zodResolver(adminPasswordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // Resetear el form cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  if (!user) {
    return null;
  }

  const onSubmit = (values: AdminPasswordChangeFormValues) => {
    toast.info('Actualizando contraseña...');
    updatePassword(
      { userId: user.id, dto: values },
      {
        onSuccess: () => {
          toast.success('Contraseña actualizada con éxito.');
          onOpenChange(false);
        },
        onError: (error: any) => {
          const apiError =
            error.response?.data?.message || 'No se pudo actualizar.';
          toast.error(apiError);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña (Admin)</DialogTitle>
          <DialogDescription>
            Estás cambiando la contraseña para{' '}
            <span className="font-medium text-foreground">
              {user.nombreUsuario}
            </span>
            .
            <br />
            <strong className="text-destructive">
              La API requiere la contraseña ACTUAL del usuario.
            </strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña ACTUAL del Usuario</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NUEVA Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar NUEVA Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {/* --- !! CORRECCIÓN AQUÍ !! --- */}
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Contraseña'
                )}
                {/* --- FIN DE LA CORRECCIÓN --- */}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
