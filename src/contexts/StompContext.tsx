// src/contexts/StompContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '@/services/auth/authStore';
import { useNotificacionStore } from '@/shared/stores/notificacionStore';
import type { NotificacionDto } from '@/services/types/simple/NotificacionDto';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const SOCKET_URL = `${API_URL}/ws`;

interface StompContextType {
  stompClient: Client | null;
  isConnected: boolean;
}

const StompContext = createContext<StompContextType>({
  stompClient: null,
  isConnected: false,
});

export const useStomp = () => useContext(StompContext);

export const StompProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const { addNotificacion } = useNotificacionStore.getState();

  useEffect(() => {
    if (accessToken) {
      if (!clientRef.current) {
        console.log('Creando nueva instancia de cliente STOMP...');

        const stompClient = new Client({
          webSocketFactory: () => new SockJS(SOCKET_URL),

          connectHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },

          debug: (str) => {
            console.log('[STOMP]:', str);
          },
          reconnectDelay: 5000,

          onConnect: () => {
            console.log('[STOMP]: Conectado exitosamente.');
            setIsConnected(true);

            stompClient.subscribe(
              '/user/queue/notifications',
              (message: IMessage) => {
                try {
                  const nuevaNotificacion = JSON.parse(
                    message.body,
                  ) as NotificacionDto;

                  addNotificacion(nuevaNotificacion);

                  // Mostrar un toast
                  toast.info(
                    `🔔 Nueva notificación: ${nuevaNotificacion.mensaje.substring(0, 30)}...`,
                  );
                } catch (e) {
                  console.error(
                    'Error al parsear notificación de WebSocket',
                    e,
                  );
                }
              },
            );
            // --- FIN DE LA SUSCRIPCIÓN ---
          },
          onDisconnect: () => {
            console.log('[STOMP]: Desconectado.');
            setIsConnected(false);
          },
          onStompError: (frame) => {
            console.error(
              '[STOMP]: Error de Broker:',
              frame.headers['message'],
            );
            console.error('[STOMP]: Detalles:', frame.body);
          },
        });

        clientRef.current = stompClient;
      }

      if (!clientRef.current.active) {
        console.log('[STOMP]: Activando cliente...');
        clientRef.current.activate();
      }
    } else {
      if (clientRef.current && clientRef.current.active) {
        console.log('[STOMP]: Desactivando cliente por logout...');
        clientRef.current.deactivate();
        clientRef.current = null;
        setIsConnected(false);
        // Limpiar notificaciones al hacer logout
        useNotificacionStore.getState().clearNotificaciones();
      }
    }

    return () => {
      if (clientRef.current && clientRef.current.active) {
        console.log('[STOMP]: Desactivando cliente (cleanup).');
        clientRef.current.deactivate();
        setIsConnected(false);
      }
    };
  }, [accessToken, addNotificacion]);

  const value = {
    stompClient: clientRef.current,
    isConnected,
  };

  return (
    <StompContext.Provider value={value}>{children}</StompContext.Provider>
  );
};
