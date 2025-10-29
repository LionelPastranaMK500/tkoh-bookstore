import { useEffect, useState } from 'react';
import { useWebSocketService } from '@/shared/hooks/useWebSocketService';

export const NotificationsWidget = () => {
  // 1. El estado debe ser un ARRAY de strings, inicializado vacío.
  const [notifications, setNotifications] = useState<string[]>([]);

  const { connect, subscribe, disconnect } = useWebSocketService(
    () => console.log('Conectado al servicio de notificaciones!'),
    (error) => console.error('Error de WebSocket:', error),
  );

  useEffect(() => {
    connect();

    // 2. Damos un tipo al 'message' que esperamos
    subscribe('/user/queue/notifications', (message: { content: string }) => {
      // 3. Esta lógica ahora funciona porque 'notifications' es un array
      setNotifications((prev) => [...prev, message.content]);
    });

    return () => {
      disconnect();
    };
  }, [connect, subscribe, disconnect]);

  return (
    <div>
      <h3>Notificaciones en Tiempo Real</h3>
      <ul>
        {/* 4. El '.map' ahora funciona porque 'notifications' es un array */}
        {notifications.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};
