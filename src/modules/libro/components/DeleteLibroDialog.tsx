// src/modules/libro/components/DeleteLibroDialog.tsx
import React from 'react';
import { toast } from 'react-toastify';
import { useDeleteLibro } from '@/services/libro/libroApi';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import type { LibroDto } from '@/services/types/simple/LibroDto';
import { Loader2 } from 'lucide-react';

interface DeleteLibroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  libro: LibroDto | null;
  onLibroDeleted: () => void;
}

export const DeleteLibroDialog: React.FC<DeleteLibroDialogProps> = ({
  open,
  onOpenChange,
  libro,
  onLibroDeleted,
}) => {
  const { mutate: deleteLibro, isPending } = useDeleteLibro();

  const onConfirmDelete = () => {
    if (!libro) return;

    toast.info('Eliminando libro...');
    deleteLibro(libro.isbn, {
      onSuccess: () => {
        toast.success(`Libro "${libro.titulo}" eliminado con éxito.`);
        onLibroDeleted();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo eliminar.';
        toast.error(apiError);
      },
    });
  };

  if (!libro) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará el libro{' '}
            <span className="font-medium text-foreground">{libro.titulo}</span>
            (ISBN: {libro.isbn}).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sí, eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
