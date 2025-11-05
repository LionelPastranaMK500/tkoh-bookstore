// src/modules/libro/components/CreateLibroDialog.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useCreateLibro } from '@/services/libro/libroApi';
import { useCategorias } from '@/services/categoria/categoriaApi';
import { useEditoriales } from '@/services/editorial/editorialApi';
import {
  libroCreateSchema,
  type LibroCreateFormValues,
} from '@/services/types/libro/LibroCreateSchema';

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

interface CreateLibroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLibroCreated: () => void;
}

export const CreateLibroDialog: React.FC<CreateLibroDialogProps> = ({
  open,
  onOpenChange,
  onLibroCreated,
}) => {
  const { mutate: createLibro, isPending } = useCreateLibro();

  const { data: categoriasQuery, isLoading: isLoadingCategorias } =
    useCategorias({ page: 0, size: 1000 });
  const { data: editorialesQuery, isLoading: isLoadingEditoriales } =
    useEditoriales({ page: 0, size: 1000 });

  const categorias = categoriasQuery?.data?.content ?? [];
  const editoriales = editorialesQuery?.data?.content ?? [];

  const form = useForm<LibroCreateFormValues>({
    resolver: zodResolver(libroCreateSchema),
    defaultValues: {
      isbn: '',
      titulo: '',
      autor: '',
      fechaPublicacion: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: LibroCreateFormValues) => {
    toast.info('Creando libro...');
    createLibro(values, {
      onSuccess: () => {
        toast.success('Libro creado con éxito.');
        onLibroCreated();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo crear el libro.';
        toast.error(apiError);
      },
    });
  };

  const isLoadingDropdowns = isLoadingCategorias || isLoadingEditoriales;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Libro</DialogTitle>
          <DialogDescription>
            Completa los detalles del nuevo libro.
          </DialogDescription>
        </DialogHeader>
        {/* Usamos ScrollArea por si el formulario es muy largo */}
        <ScrollArea className="max-h-[70vh] pr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN (ID Único)</FormLabel>
                    <FormControl>
                      <Input placeholder="978-3-16-148410-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="El nombre del viento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="autor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Patrick Rothfuss" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaPublicacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Publicación</FormLabel>
                    <FormControl>
                      {/* El schema espera un string, por eso type="date" funciona bien */}
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLoadingDropdowns ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="categoriaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categorias.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.nombre}
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
                    name="editorialId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Editorial</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una editorial" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {editoriales.map((e) => (
                              <SelectItem key={e.id} value={String(e.id)}>
                                {e.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
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
                <Button
                  type="submit"
                  disabled={isPending || isLoadingDropdowns}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Crear Libro
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
