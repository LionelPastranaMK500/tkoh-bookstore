// src/modules/editorial/components/EditEditorialDialog.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useUpdateEditorial } from '@/services/editorial/editorialApi';
import {
  editorialUpdateSchema,
  type EditorialUpdateFormValues,
} from '@/services/types/editorial/EditorialUpdateSchema';
import type { EditorialDto } from '@/services/types/simple/EditorialDto';

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

interface EditEditorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editorial: EditorialDto | null;
  onEditorialUpdated: () => void;
}

export const EditEditorialDialog: React.FC<EditEditorialDialogProps> = ({
  open,
  onOpenChange,
  editorial,
  onEditorialUpdated,
}) => {
  const { mutate: updateEditorial, isPending } = useUpdateEditorial();

  const form = useForm<EditorialUpdateFormValues>({
    resolver: zodResolver(editorialUpdateSchema),
    defaultValues: {
      id: 0,
      nombre: '',
    },
  });

  useEffect(() => {
    if (editorial && open) {
      form.reset({
        id: editorial.id,
        nombre: editorial.nombre,
      });
    }
  }, [editorial, open, form]);

  const onSubmit = (values: EditorialUpdateFormValues) => {
    toast.info('Actualizando editorial...');
    updateEditorial(values, {
      onSuccess: (data) => {
        toast.success(`Editorial "${data.data.nombre}" actualizada.`);
        onEditorialUpdated();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo actualizar.';
        toast.error(apiError);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Editorial</DialogTitle>
          <DialogDescription>
            Modifica el nombre de la editorial.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Editorial</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
