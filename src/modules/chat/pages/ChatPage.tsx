// src/modules/chat/pages/ChatPage.tsx
import React, { useState, useMemo } from 'react'; // 1. Importar useMemo
import { ConversacionList } from '../components/ConversacionList';
import { SalaDeChat } from '../components/SalaDeChat';
import { CreateConversacionDialog } from '../components/CreateConversacionDialog';
import { Button } from '@/shared/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuthStore } from '@/services/auth/authStore';
import { useMisConversaciones } from '@/services/mensajeria/conversacionApi';

export const ChatPage: React.FC = () => {
  const [selectedConversacionId, setSelectedConversacionId] = useState<
    number | null
  >(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { refetch: refetchConversaciones } = useMisConversaciones();

  // --- 💡 INICIO DE LA CORRECCIÓN ---

  // 2. Selecciona el array de roles original (estable)
  const roles = useAuthStore((state) => state.user?.roles);

  // 3. Deriva el array de nombres SOLO si `roles` cambia
  const userRoles = useMemo(
    () => roles?.map((r) => r.nombreRol) || [],
    [roles], // Esta dependencia es estable y no causará bucles
  );

  // 4. Este useMemo ahora depende del `userRoles` estable
  const canCreate = useMemo(
    () =>
      userRoles.some(
        (r) =>
          r === 'OWNER' ||
          r === 'ADMIN' ||
          r === 'CONVERSATION_START_WITH_SELLER',
      ),
    [userRoles],
  );

  // --- 💡 FIN DE LA CORRECCIÓN ---

  return (
    <>
      <div className="container flex h-[calc(100vh-5rem)] py-4">
        {/* Columna Izquierda: Lista de Chats */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Mensajes</h2>
            {canCreate && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCreateOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <ConversacionList
              selectedId={selectedConversacionId}
              onSelect={setSelectedConversacionId}
            />
          </div>
        </div>

        {/* Columna Derecha: Sala de Chat */}
        <div className="w-2/3 h-full">
          <SalaDeChat conversacionId={selectedConversacionId} />
        </div>
      </div>

      {/* Renderizar el modal */}
      {canCreate && (
        <CreateConversacionDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onConversacionCreated={() => {
            refetchConversaciones();
          }}
        />
      )}
    </>
  );
};
