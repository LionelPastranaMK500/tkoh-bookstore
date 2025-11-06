// src/modules/tarea/components/EditTareaDialog.tsx
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  tareaUpdateSchema,
  type TareaUpdateFormValues,
} from '@/services/types/tarea/TareaUpdateSchema';
import { useTareaDetail, useUpdateTarea } from '@/services/tarea/tareaApi';
import { useUsers } from '@/services/admin/userApi';
import type { TareaDto } from '@/services/types/simple/TareaDto';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';

// Helper para formatear un string Instant (ISO) a un string YYYY-MM-DD
const formatInstantToDateInput = (instantString: string | undefined) => {
  if (!instantString) return '';
  try {
    return instantString.split('T')[0];
  } catch (e) {
    return '';
  }
};

interface EditTareaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tarea: TareaDto | null;
  onTareaUpdated: () => void;
}

export const EditTareaDialog: React.FC<EditTareaDialogProps> = ({
  open,
  onOpenChange,
  tarea,
  onTareaUpdated,
}) => {
  const { mutate: updateTarea, isPending } = useUpdateTarea();

  // 1. Hook para obtener el detalle de la tarea
  const {
    data: tareaDetailQuery,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useTareaDetail(tarea?.id ?? 0);

  // 2. Cargar lista de usuarios
  const { data: usersQuery, isLoading: isLoadingUsers } = useUsers();
  const usuarios = usersQuery?.data?.content ?? [];

  // 3. Valores por defecto
  const defaultValues = useMemo(
    () => ({
      id: tareaDetailQuery?.data?.id ?? 0,
      descripcion: tareaDetailQuery?.data?.descripcion ?? '',
      fechaLimite: formatInstantToDateInput(
        tareaDetailQuery?.data?.fechaLimite,
      ),
      completado: tareaDetailQuery?.data?.completado ?? false,
      usuarioAsignadoId: tareaDetailQuery?.data?.usuarioAsignadoId ?? 0,
    }),
    [tareaDetailQuery],
  );

  const form = useForm<TareaUpdateFormValues>({
    resolver: zodResolver(tareaUpdateSchema),
    values: defaultValues,
  });

  useEffect(() => {
    if (open && tareaDetailQuery?.data) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form, tareaDetailQuery]);

  const onSubmit = (values: TareaUpdateFormValues) => {
    toast.info('Actualizando tarea...');
    updateTarea(values, {
      onSuccess: () => {
        toast.success('Tarea actualizada con éxito.');
        onTareaUpdated();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo actualizar la tarea.';
        toast.error(apiError);
      },
    });
  };

  const isLoading = isPending || isLoadingUsers || isLoadingDetail;

  const renderFormContent = () => {
    if (isLoadingDetail) {
      return (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    if (detailError) {
      return (
        <div className="flex h-48 items-center justify-center text-destructive">
          <AlertCircle className="mr-2 h-4 w-4 inline" />
          <span>Error al cargar detalles: {detailError.message}</span>
        </div>
      );
    }
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fechaLimite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Límite (Opcional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usuarioAsignadoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reasignar a Usuario</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={String(field.value)}
                  disabled={isLoadingUsers}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {usuarios.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.nombreUsuario} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="completado"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Estado de la Tarea</FormLabel>
                  <FormDescription>
                    {field.value ? 'Tarea completada' : 'Tarea pendiente'}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <DialogFooter className="sticky bottom-0 bg-background pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Tarea</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la tarea asignada.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          {renderFormContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
