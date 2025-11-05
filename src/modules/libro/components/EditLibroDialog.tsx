// src/modules/libro/components/EditLibroDialog.tsx
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useUpdateLibro, useLibroDetail } from '@/services/libro/libroApi';
import { useCategorias } from '@/services/categoria/categoriaApi';
import { useEditoriales } from '@/services/editorial/editorialApi';
import {
  libroUpdateSchema,
  type LibroUpdateFormValues,
} from '@/services/types/libro/LibroUpdateSchema';
import type { LibroDto } from '@/services/types/simple/LibroDto';

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
import { Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';

// Helper para formatear un string Instant (ISO) a un string YYYY-MM-DD para el input[type=date]
const formatInstantToDateInput = (instantString: string | undefined) => {
  if (!instantString) return '';
  try {
    return instantString.split('T')[0];
  } catch (e) {
    console.error('Error formateando fecha:', e);
    return '';
  }
};

interface EditLibroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  libro: LibroDto | null; // Usamos el DTO simple de la tabla
  onLibroUpdated: () => void;
}

export const EditLibroDialog: React.FC<EditLibroDialogProps> = ({
  open,
  onOpenChange,
  libro,
  onLibroUpdated,
}) => {
  const { mutate: updateLibro, isPending } = useUpdateLibro();

  // 1. Hook para obtener el detalle (incluye IDs de categoria/editorial)
  const {
    data: libroDetailQuery,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useLibroDetail(libro?.isbn ?? '');

  // 2. Cargar listas para los <Select>
  const { data: categoriasQuery, isLoading: isLoadingCategorias } =
    useCategorias({ page: 0, size: 1000 });
  const { data: editorialesQuery, isLoading: isLoadingEditoriales } =
    useEditoriales({ page: 0, size: 1000 });

  const categorias = categoriasQuery?.data?.content ?? [];
  const editoriales = editorialesQuery?.data?.content ?? [];

  // 3. Valores por defecto derivados de la query de detalle
  const defaultValues = useMemo(
    () => ({
      isbn: libroDetailQuery?.data?.isbn ?? '',
      titulo: libroDetailQuery?.data?.titulo ?? '',
      autor: libroDetailQuery?.data?.autor ?? '',
      fechaPublicacion: formatInstantToDateInput(
        libroDetailQuery?.data?.fechaPublicacion,
      ),
      categoriaId: libroDetailQuery?.data?.categoria.id ?? 0,
      editorialId: libroDetailQuery?.data?.editorial.id ?? 0,
    }),
    [libroDetailQuery],
  );

  const form = useForm<LibroUpdateFormValues>({
    resolver: zodResolver(libroUpdateSchema),
    // Usamos 'values' en lugar de 'defaultValues' para que el formulario se actualice
    // cuando los datos de 'useLibroDetail' (defaultValues) cambien.
    values: defaultValues,
  });

  // 4. Resetear el formulario si se cierra o cambia el libro
  useEffect(() => {
    if (open && libroDetailQuery?.data) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form, libroDetailQuery]);

  const onSubmit = (values: LibroUpdateFormValues) => {
    toast.info('Actualizando libro...');
    updateLibro(values, {
      onSuccess: () => {
        toast.success('Libro actualizado con éxito.');
        onLibroUpdated();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo actualizar el libro.';
        toast.error(apiError);
      },
    });
  };

  const isLoadingDropdowns = isLoadingCategorias || isLoadingEditoriales;

  const renderFormContent = () => {
    if (isLoadingDetail) {
      return (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Cargando detalles...</span>
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
    // Renderizar el formulario solo si tenemos los datos del libro
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN (No editable)</FormLabel>
                <FormControl>
                  <Input {...field} readOnly disabled />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                    {/* Usamos 'value' para asegurar que el valor seleccionado se muestre */}
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
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
                      value={String(field.value)}
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
              disabled={isPending || isLoadingDropdowns || isLoadingDetail}
            >
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
          <DialogTitle>Editar Libro</DialogTitle>
          <DialogDescription>
            Modifica los detalles del libro.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          {renderFormContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
