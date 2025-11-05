// src/modules/categoria/components/DeleteCategoriaDialog.tsx
import React from 'react';
import { toast } from 'react-toastify';
import { useDeleteCategoria } from '@/services/categoria/categoriaApi';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import type { CategoriaDto } from '@/services/types/simple/CategoriaDto';
import { Loader2 } from 'lucide-react';

interface DeleteCategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoria: CategoriaDto | null;
  onCategoriaDeleted: () => void;
}

export const DeleteCategoriaDialog: React.FC<DeleteCategoriaDialogProps> = ({
  open,
  onOpenChange,
  categoria,
  onCategoriaDeleted,
}) => {
  const { mutate: deleteCategoria, isPending } = useDeleteCategoria();

  const onConfirmDelete = () => {
    if (!categoria) return;

    toast.info('Eliminando categoría...');
    deleteCategoria(categoria.id, {
      onSuccess: () => {
        toast.success(`Categoría "${categoria.nombre}" eliminada con éxito.`);
        onCategoriaDeleted();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo eliminar.';
        toast.error(apiError);
      },
    });
  };

  if (!categoria) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará la categoría{' '}
            <span className="font-medium text-foreground">
              {categoria.nombre}
            </span>
            .
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
