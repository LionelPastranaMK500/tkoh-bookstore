// src/modules/chat/components/CreateConversacionDialog.tsx
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  conversacionCreateSchema,
  type ConversacionCreateFormValues,
} from '@/services/types/conversacion/ConversacionCreateSchema';
import { useIniciarConversacion } from '@/services/mensajeria/conversacionApi';
import { useUsers } from '@/services/admin/userApi';
import { useAuthStore } from '@/services/auth/authStore';

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
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';

interface CreateConversacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversacionCreated: () => void;
}

export const CreateConversacionDialog: React.FC<
  CreateConversacionDialogProps
> = ({ open, onOpenChange, onConversacionCreated }) => {
  const { mutate: iniciarConversacion, isPending } = useIniciarConversacion();

  // 1. Obtener el ID del usuario actual para filtrarlo de la lista
  const currentUserId = useAuthStore((state) => state.user?.id);

  // 2. Obtener lista de todos los usuarios
  const { data: usersQuery, isLoading: isLoadingUsers } = useUsers();

  // 3. Filtrar al usuario actual de la lista de participantes
  const otrosUsuarios = useMemo(() => {
    return (
      usersQuery?.data?.content.filter((u) => u.id !== currentUserId) ?? []
    );
  }, [usersQuery, currentUserId]);

  const form = useForm<ConversacionCreateFormValues>({
    resolver: zodResolver(conversacionCreateSchema),
    defaultValues: {
      asunto: '',
      participanteIds: [],
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: ConversacionCreateFormValues) => {
    toast.info('Iniciando conversación...');
    iniciarConversacion(values, {
      onSuccess: () => {
        toast.success('Conversación iniciada con éxito.');
        onConversacionCreated();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message ||
          'No se pudo iniciar la conversación.';
        toast.error(apiError);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar Nueva Conversación</DialogTitle>
          <DialogDescription>
            Selecciona los participantes y un asunto (opcional).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="asunto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Consulta sobre pedido #123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="participanteIds"
              render={() => (
                <FormItem>
                  <FormLabel>Destinatarios</FormLabel>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {isLoadingUsers ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <div className="space-y-2">
                        {otrosUsuarios.map((user) => (
                          <FormField
                            key={user.id}
                            control={form.control}
                            name="participanteIds"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(user.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            user.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== user.id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <Label className="font-normal">
                                  {user.nombreUsuario} ({user.email})
                                </Label>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <FormMessage />
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
              <Button type="submit" disabled={isPending || isLoadingUsers}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Conversación
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
