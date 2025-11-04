import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  useUser, // 1. Hook para OBTENER datos
  useUpdateUser, // 2. Hook para ACTUALIZAR datos
} from '@/services/admin/userApi';
import type { UsuarioDto } from '@/services/types/simple/UsuarioDto';
import {
  usuarioUpdateSchema,
  type UsuarioUpdateFormValues,
} from '@/services/types/update/UsuarioUpdateSchema'; // 3. Importar el schema

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { Loader2 } from 'lucide-react';
import { Label } from '@/shared/ui/label'; // Importar Label

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UsuarioDto | null; // El usuario de la tabla
  onUserUpdated: () => void; // Para refrescar la tabla
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  user,
  onUserUpdated,
}) => {
  // 1. Hook de mutación para ENVIAR la actualización
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  // 2. Hook de query para OBTENER los datos frescos del usuario
  const {
    data: userQuery,
    isLoading: isLoadingUser,
    error,
  } = useUser(user?.id ?? 0);

  // 3. Configuración de React Hook Form
  const form = useForm<UsuarioUpdateFormValues>({
    resolver: zodResolver(usuarioUpdateSchema),
    defaultValues: {
      id: user?.id ?? 0,
      nombreUsuario: '',
      celular: '',
      enabled: true,
      accountNonLocked: true,
    },
  });

  // 4. Lógica de "pre-llenado" del formulario
  useEffect(() => {
    // Solo resetea el formulario si la query tiene datos
    if (userQuery?.data) {
      const userData = userQuery.data;
      form.reset({
        id: userData.id,
        nombreUsuario: userData.nombreUsuario,
        celular: userData.celular || '',
        enabled: userData.enabled,
        accountNonLocked: userData.accountNonLocked,
      });
    }
  }, [userQuery?.data, form, open]); // Añadimos 'open' para resetear al abrir

  // 5. Lógica de Submit
  const onSubmit = (values: UsuarioUpdateFormValues) => {
    toast.info('Actualizando usuario...');

    // --- !! CORRECCIÓN !! ---
    // Llamar a 'updateUser' (el nombre renombrado) en lugar de 'mutate'
    updateUser(values, {
      onSuccess: (data) => {
        toast.success(
          `Usuario "${data.data.nombreUsuario}" actualizado con éxito`,
        );
        onUserUpdated(); // Refresca la tabla
        onOpenChange(false); // Cierra el modal
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo actualizar el usuario.';
        toast.error(apiError);
      },
    });
  };

  const renderFormContent = () => {
    if (isLoadingUser) {
      return (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Cargando datos...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-destructive">
          Error al cargar datos: {error.message}
        </div>
      );
    }

    // Si no hay carga y no hay error, mostrar el formulario
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email (solo lectura) */}
          <div className="space-y-2">
            <Label>Email (No editable)</Label>
            <Input readOnly disabled value={userQuery?.data.email ?? ''} />
          </div>

          {/* Nombre de Usuario */}
          <FormField
            control={form.control}
            name="nombreUsuario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de Usuario</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Celular */}
          <FormField
            control={form.control}
            name="celular"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="+51987654321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estado: Habilitado (enabled) */}
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Cuenta Habilitada</FormLabel>
                  <FormDescription>
                    Permite al usuario iniciar sesión.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isUpdating}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Estado: No Bloqueado (accountNonLocked) */}
          <FormField
            control={form.control}
            name="accountNonLocked"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Cuenta No Bloqueada</FormLabel>
                  <FormDescription>
                    Si está "apagado", la cuenta está bloqueada.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isUpdating}
                  />
                </FormControl>
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
            <Button type="submit" disabled={isUpdating || isLoadingUser}>
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Actualiza la información del usuario.
          </DialogDescription>
        </DialogHeader>

        {renderFormContent()}
      </DialogContent>
    </Dialog>
  );
};
