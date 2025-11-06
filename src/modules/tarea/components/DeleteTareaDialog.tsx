// src/modules/tarea/components/DeleteTareaDialog.tsx
import React from 'react';
import { toast } from 'react-toastify';
import { useDeleteTarea } from '@/services/tarea/tareaApi';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import type { TareaDto } from '@/services/types/simple/TareaDto';
import { Loader2 } from 'lucide-react';

interface DeleteTareaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tarea: TareaDto | null;
  onTareaDeleted: () => void;
}

export const DeleteTareaDialog: React.FC<DeleteTareaDialogProps> = ({
  open,
  onOpenChange,
  tarea,
  onTareaDeleted,
}) => {
  const { mutate: deleteTarea, isPending } = useDeleteTarea();

  const onConfirmDelete = () => {
    if (!tarea) return;

    toast.info('Eliminando tarea...');
    deleteTarea(tarea.id, {
      onSuccess: () => {
        toast.success(`Tarea (ID: ${tarea.id}) eliminada con éxito.`);
        onTareaDeleted();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const apiError =
          error.response?.data?.message || 'No se pudo eliminar.';
        toast.error(apiError);
      },
    });
  };

  if (!tarea) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará la tarea:
            <span className="font-medium text-foreground ml-1">
              "{tarea.descripcion}"
            </span>
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
