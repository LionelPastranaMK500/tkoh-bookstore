// src/modules/tarea/components/CreateTareaDialog.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  tareaCreateSchema,
  type TareaCreateFormValues,
} from '@/services/types/tarea/TareaCreateSchema';
import { useCreateTarea } from '@/services/tarea/tareaApi';
import { useUsers } from '@/services/admin/userApi';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';

interface CreateTareaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTareaCreated: () => void;
}

export const CreateTareaDialog: React.FC<CreateTareaDialogProps> = ({
  open,
  onOpenChange,
  onTareaCreated,
}) => {
  const { mutate: createTarea, isPending } = useCreateTarea();

  // Obtener lista de usuarios para el dropdown
  const { data: usersQuery, isLoading: isLoadingUsers } = useUsers();
  const usuarios = usersQuery?.data?.content ?? [];

  const form = useForm<TareaCreateFormValues>({
    resolver: zodResolver(tareaCreateSchema),
    defaultValues: {
      descripcion: '',
      fechaLimite: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: TareaCreateFormValues) => {
    toast.info('Creando tarea...');
    createTarea(values, {
      onSuccess: () => {
        toast.success('Tarea creada y asignada con éxito.');
        onTareaCreated();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo crear la tarea.';
        toast.error(apiError);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar Nueva Tarea</DialogTitle>
          <DialogDescription>
            Completa los detalles y asigna la tarea a un usuario.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción de la Tarea</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Contactar al cliente X"
                        {...field}
                      />
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

              {isLoadingUsers ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FormField
                  control={form.control}
                  name="usuarioAsignadoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asignar a Usuario</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
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
              )}

              <DialogFooter className="sticky bottom-0 bg-background pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending || isLoadingUsers}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Crear Tarea
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
