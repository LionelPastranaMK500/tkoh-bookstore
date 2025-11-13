// src/modules/libro/components/LibroDetailsDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { useLibroDetail } from '@/services/libro/libroApi';
import { Loader2, AlertCircle } from 'lucide-react';
import type { LibroDetailDto } from '@/services/types/detail/LibroDetailDto';

interface LibroDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isbn: string | null;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-1 border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <div className="text-sm text-foreground text-left sm:text-right">
      {children}
    </div>
  </div>
);

export const LibroDetailsDialog: React.FC<LibroDetailsDialogProps> = ({
  open,
  onOpenChange,
  isbn,
}) => {
  const { data: apiResponse, isLoading, error } = useLibroDetail(isbn ?? '');
  const libro: LibroDetailDto | undefined = apiResponse?.data;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Cargando detalles...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-48 flex-col items-center justify-center text-destructive">
          <AlertCircle className="mr-2 h-8 w-8" />
          <span className="font-medium">Error al cargar el libro</span>
          <p className="text-sm">{error.message}</p>
        </div>
      );
    }

    if (libro) {
      return (
        <div className="space-y-4 py-4">
          <DetailItem label="ISBN">{libro.isbn}</DetailItem>
          <DetailItem label="Título">{libro.titulo}</DetailItem>
          <DetailItem label="Autor">
            {libro.autor || 'No registrado'}
          </DetailItem>
          <DetailItem label="Fecha de Publicación">
            {new Date(libro.fechaPublicacion).toLocaleDateString()}
          </DetailItem>
          <DetailItem label="Categoría">
            <Badge variant="secondary">{libro.categoria.nombre}</Badge>
          </DetailItem>
          <DetailItem label="Editorial">
            <Badge variant="outline">{libro.editorial.nombre}</Badge>
          </DetailItem>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles del Libro</DialogTitle>
          <DialogDescription>
            Información detallada del libro seleccionado.
          </DialogDescription>
        </DialogHeader>

        {renderContent()}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
