// src/modules/editorial/components/DeleteEditorialDialog.tsx
import React from 'react';
import { toast } from 'react-toastify';
import { useDeleteEditorial } from '@/services/editorial/editorialApi';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import type { EditorialDto } from '@/services/types/simple/EditorialDto';
import { Loader2 } from 'lucide-react';

interface DeleteEditorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editorial: EditorialDto | null;
  onEditorialDeleted: () => void;
}

export const DeleteEditorialDialog: React.FC<DeleteEditorialDialogProps> = ({
  open,
  onOpenChange,
  editorial,
  onEditorialDeleted,
}) => {
  const { mutate: deleteEditorial, isPending } = useDeleteEditorial();

  const onConfirmDelete = () => {
    if (!editorial) return;

    toast.info('Eliminando editorial...');
    deleteEditorial(editorial.id, {
      onSuccess: () => {
        toast.success(`Editorial "${editorial.nombre}" eliminada con éxito.`);
        onEditorialDeleted();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo eliminar.';
        toast.error(apiError);
      },
    });
  };

  if (!editorial) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará la editorial{' '}
            <span className="font-medium text-foreground">
              {editorial.nombre}
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
