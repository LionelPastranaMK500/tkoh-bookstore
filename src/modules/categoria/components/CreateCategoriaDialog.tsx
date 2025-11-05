// src/modules/categoria/components/CreateCategoriaDialog.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useCreateCategoria } from '@/services/categoria/categoriaApi';
import {
  categoriaCreateSchema,
  type CategoriaCreateFormValues,
} from '@/services/types/categoria/CategoriaCreateSchema';

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

interface CreateCategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoriaCreated: () => void;
}

export const CreateCategoriaDialog: React.FC<CreateCategoriaDialogProps> = ({
  open,
  onOpenChange,
  onCategoriaCreated,
}) => {
  const { mutate: createCategoria, isPending } = useCreateCategoria();

  const form = useForm<CategoriaCreateFormValues>({
    resolver: zodResolver(categoriaCreateSchema),
    defaultValues: {
      nombre: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: CategoriaCreateFormValues) => {
    toast.info('Creando categoría...');
    createCategoria(values, {
      onSuccess: () => {
        toast.success('Categoría creada con éxito.');
        onCategoriaCreated();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo crear la categoría.';
        toast.error(apiError);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Categoría</DialogTitle>
          <DialogDescription>
            Añade una nueva categoría para organizar los libros.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Categoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ciencia Ficción" {...field} />
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
                Crear Categoría
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
