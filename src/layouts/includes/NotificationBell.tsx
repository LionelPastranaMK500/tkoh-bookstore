// src/layouts/includes/NotificationBell.tsx
import React, { useEffect } from 'react';
import { Bell, Check, Trash2, Loader2, Info } from 'lucide-react';
import {
  useMisNotificaciones,
  useMarcarComoLeida,
  useEliminarNotificacion,
} from '@/services/notificacion/notificacionApi';
import { useNotificacionStore } from '@/shared/stores/notificacionStore';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Badge } from '@/shared/ui/badge';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

// Helper para formatear el tiempo (ej. "hace 5 min")
const timeAgo = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'a';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'm';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' min';
  return 'justo ahora';
};

export const NotificationBell: React.FC = () => {
  // 1. Obtener estado del store global
  const {
    notificaciones,
    noLeidasCount,
    setNotificaciones,
    markAsReadInStore,
    removeFromStore,
  } = useNotificacionStore();

  // 2. Hook de React Query para la carga inicial
  const { data: queryData, isLoading: isLoadingFetch } = useMisNotificaciones();

  // 3. Hooks de mutación
  const { mutate: markAsRead, isPending: isMarking } = useMarcarComoLeida();
  const { mutate: deleteNotification, isPending: isDeleting } =
    useEliminarNotificacion();

  // 4. Efecto para poblar el store cuando la carga inicial (query) finaliza
  useEffect(() => {
    if (queryData?.data) {
      setNotificaciones(queryData.data);
    }
  }, [queryData, setNotificaciones]);

  // 5. Manejadores de acciones
  const handleMarkAsRead = (id: number) => {
    markAsRead(id, {
      onSuccess: () => {
        markAsReadInStore(id);
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message || 'Error al marcar como leída',
        );
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteNotification(id, {
      onSuccess: () => {
        removeFromStore(id);
        toast.success('Notificación eliminada');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Error al eliminar');
      },
    });
  };

  const isPending = isMarking || isDeleting;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {noLeidasCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 px-1.5 justify-center"
            >
              {noLeidasCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notificaciones
          {isLoadingFetch && <Loader2 className="h-4 w-4 animate-spin" />}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notificaciones.length === 0 && !isLoadingFetch && (
            <DropdownMenuItem
              disabled
              className="flex flex-col items-center justify-center py-4"
            >
              <Info className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No tienes notificaciones</p>
            </DropdownMenuItem>
          )}

          {notificaciones.map((n) => (
            <React.Fragment key={n.id}>
              <DropdownMenuItem
                className={cn(
                  'flex flex-col items-start gap-1 p-3 whitespace-normal cursor-default',
                  !n.leido && 'bg-accent/50',
                )}
                onSelect={(e) => e.preventDefault()} // Evitar que el menú se cierre
              >
                <p className="text-sm font-medium">{n.mensaje}</p>
                <p className="text-xs text-muted-foreground">
                  {timeAgo(n.fechaCreacion)}
                </p>
                <div className="flex gap-2 mt-2 self-end">
                  {!n.leido && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkAsRead(n.id)}
                      disabled={isPending}
                      className="h-7 px-2"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Leído
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(n.id)}
                    disabled={isPending}
                    className="h-7 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Borrar
                  </Button>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
