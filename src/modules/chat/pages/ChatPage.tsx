// src/modules/chat/pages/ChatPage.tsx
import React, { useState } from 'react';
import { ConversacionList } from '../components/ConversacionList';
import { SalaDeChat } from '../components/SalaDeChat';

export const ChatPage: React.FC = () => {
  const [selectedConversacionId, setSelectedConversacionId] = useState<
    number | null
  >(null);

  return (
    <div className="container flex h-[calc(100vh-5rem)] py-4">
      {/* Columna Izquierda: Lista de Chats */}
      <div className="w-1/3 border-r">
        <ConversacionList
          selectedId={selectedConversacionId}
          onSelect={setSelectedConversacionId}
        />
      </div>

      {/* Columna Derecha: Sala de Chat */}
      <div className="w-2/3 h-full">
        <SalaDeChat conversacionId={selectedConversacionId} />
      </div>
    </div>
  );
};
