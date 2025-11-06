// src/modules/chat/components/ConversacionList.tsx
import React from 'react';
import { useMisConversaciones } from '@/services/mensajeria/conversacionApi';
import { Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ConversacionListProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const ConversacionList: React.FC<ConversacionListProps> = ({
  selectedId,
  onSelect,
}) => {
  const {
    data: conversacionesQuery,
    isLoading,
    error,
  } = useMisConversaciones();

  const conversaciones = conversacionesQuery?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        <AlertCircle className="inline-block mr-2" />
        Error al cargar chats.
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 p-2">
        {conversaciones.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No tienes conversaciones.
          </div>
        )}
        {/* TypeScript sabe que 'chat' es de tipo 'ConversacionDto' por inferencia */}
        {conversaciones.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={cn(
              'w-full text-left p-3 rounded-md hover:bg-accent transition-colors',
              selectedId === chat.id ? 'bg-accent' : '',
            )}
          >
            <p className="font-semibold truncate">
              {chat.asunto || `Conversación #${chat.id}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(chat.fechaCreacion).toLocaleDateString()}
            </p>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};
