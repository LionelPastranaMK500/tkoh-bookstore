// src/modules/editorial/components/CreateEditorialDialog.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useCreateEditorial } from '@/services/editorial/editorialApi';
import {
  editorialCreateSchema,
  type EditorialCreateFormValues,
} from '@/services/types/editorial/EditorialCreateSchema';

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

interface CreateEditorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditorialCreated: () => void;
}

export const CreateEditorialDialog: React.FC<CreateEditorialDialogProps> = ({
  open,
  onOpenChange,
  onEditorialCreated,
}) => {
  const { mutate: createEditorial, isPending } = useCreateEditorial();

  const form = useForm<EditorialCreateFormValues>({
    resolver: zodResolver(editorialCreateSchema),
    defaultValues: {
      nombre: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: EditorialCreateFormValues) => {
    toast.info('Creando editorial...');
    createEditorial(values, {
      onSuccess: () => {
        toast.success('Editorial creada con éxito.');
        onEditorialCreated();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo crear la editorial.';
        toast.error(apiError);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Editorial</DialogTitle>
          <DialogDescription>
            Añade una nueva editorial para los libros.
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
                    <Input placeholder="Ej: Penguin Books" {...field} />
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
                Crear Editorial
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
