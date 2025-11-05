// src/modules/categoria/components/EditCategoriaDialog.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useUpdateCategoria } from '@/services/categoria/categoriaApi';
import {
  categoriaUpdateSchema,
  type CategoriaUpdateFormValues,
} from '@/services/types/categoria/CategoriaUpdateSchema';
import type { CategoriaDto } from '@/services/types/simple/CategoriaDto';

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

interface EditCategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoria: CategoriaDto | null;
  onCategoriaUpdated: () => void;
}

export const EditCategoriaDialog: React.FC<EditCategoriaDialogProps> = ({
  open,
  onOpenChange,
  categoria,
  onCategoriaUpdated,
}) => {
  const { mutate: updateCategoria, isPending } = useUpdateCategoria();

  const form = useForm<CategoriaUpdateFormValues>({
    resolver: zodResolver(categoriaUpdateSchema),
    defaultValues: {
      id: 0,
      nombre: '',
    },
  });

  // Cargar datos en el formulario cuando el modal se abre
  useEffect(() => {
    if (categoria && open) {
      form.reset({
        id: categoria.id,
        nombre: categoria.nombre,
      });
    }
  }, [categoria, open, form]);

  const onSubmit = (values: CategoriaUpdateFormValues) => {
    toast.info('Actualizando categoría...');
    updateCategoria(values, {
      onSuccess: (data) => {
        toast.success(`Categoría "${data.data.nombre}" actualizada.`);
        onCategoriaUpdated();
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
          <DialogTitle>Editar Categoría</DialogTitle>
          <DialogDescription>
            Modifica el nombre de la categoría.
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
