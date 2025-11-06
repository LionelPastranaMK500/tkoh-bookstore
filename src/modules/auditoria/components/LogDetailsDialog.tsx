// src/modules/auditoria/components/LogDetailsDialog.tsx
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
import { useLogDetail } from '@/services/auditoria/logApi';
import { Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';

interface LogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logId: number | null;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-1 border-b pb-2">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <div className="text-sm text-foreground">{children}</div>
  </div>
);

export const LogDetailsDialog: React.FC<LogDetailsDialogProps> = ({
  open,
  onOpenChange,
  logId,
}) => {
  const { data: apiResponse, isLoading, error } = useLogDetail(logId ?? 0);
  const log = apiResponse?.data;

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
          <span className="font-medium">Error al cargar el log</span>
          <p className="text-sm">{error.message}</p>
        </div>
      );
    }

    if (log) {
      return (
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            <DetailItem label="ID de Log">{log.id}</DetailItem>
            <DetailItem label="Fecha y Hora">
              {new Date(log.fecha).toLocaleString()}
            </DetailItem>
            <DetailItem label="Usuario (ID)">
              {log.usuarioId} ({log.usuarioNombre})
            </DetailItem>
            <DetailItem label="Acción Realizada">
              {log.accionRealizada}
            </DetailItem>
            <DetailItem label="Detalles">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {log.detalles || 'N/A'}
              </pre>
            </DetailItem>
          </div>
        </ScrollArea>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles del Log de Actividad</DialogTitle>
          <DialogDescription>
            Información detallada sobre el evento registrado.
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
