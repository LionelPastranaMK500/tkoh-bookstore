// src/modules/chat/components/MensajeItem.tsx
import React from 'react';
import type { MensajeDto } from '@/services/types/simple/MensajeDto';
import { useAuthStore } from '@/services/auth/authStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';

export const MensajeItem: React.FC<{ mensaje: MensajeDto }> = ({ mensaje }) => {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const esMio = mensaje.usuarioEmisorId === currentUserId;

  const remitenteIniciales = mensaje.usuarioEmisorNombre
    ? mensaje.usuarioEmisorNombre.substring(0, 2).toUpperCase()
    : '??';

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        esMio ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* 3. Se usan los componentes reales importados */}
      <Avatar className="h-10 w-10">
        <AvatarFallback>{remitenteIniciales}</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          'max-w-[75%] rounded-lg p-3 shadow-sm',
          esMio
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {!esMio && (
          <p className="text-xs font-semibold mb-1">
            {mensaje.usuarioEmisorNombre}
          </p>
        )}
        <p className="text-sm">{mensaje.cuerpoMensaje}</p>
        <p
          className={cn(
            'text-xs mt-2',
            esMio ? 'text-primary-foreground/70' : 'text-muted-foreground/70',
            esMio ? 'text-right' : 'text-left',
          )}
        >
          {new Date(mensaje.fechaEnvio).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};
