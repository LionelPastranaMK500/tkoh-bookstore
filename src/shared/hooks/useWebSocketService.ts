import { useRef, useCallback } from 'react';
// 1. Importamos IFrame para tipar el error 'frame'
import { Client, type IMessage, type IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '@/features/auth/model/authStore';

type SubscriptionCallback = (message: any) => void;

export const useWebSocketService = (
  onConnectCallback: () => void,
  onErrorCallback: (error: string) => void,
) => {
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());

  const connect = useCallback(() => {
    if (clientRef.current?.active) return;
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      onErrorCallback(
        'No hay token de autenticación para la conexión WebSocket.',
      );
      return;
    }

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      // 2. Corregimos el 'any' implícito de 'str'
      debug: (str: string) => console.log('STOMP: ' + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket conectado');
        onConnectCallback();
      },
      // 3. Corregimos el 'any' implícito de 'frame'
      onStompError: (frame: IFrame) => {
        onErrorCallback(
          frame.headers['message'] || 'Error desconocido de STOMP',
        );
      },
    });

    client.activate();
    clientRef.current = client;
    // 4. Añadimos el array de dependencias al useCallback
  }, [onConnectCallback, onErrorCallback]);

  const subscribe = useCallback(
    (destination: string, callback: SubscriptionCallback) => {
      const client = clientRef.current;
      if (!client?.active || subscriptionsRef.current.has(destination)) return;

      const subscription = client.subscribe(
        destination,
        (message: IMessage) => {
          try {
            if (message.body) callback(JSON.parse(message.body));
          } catch (e) {
            console.error('Error al parsear el mensaje WebSocket:', e);
          }
        },
      );
      subscriptionsRef.current.set(destination, subscription);
    },
    [], // 4. Añadimos el array de dependencias al useCallback
  );

  const send = useCallback(
    (destination: string, body: Record<string, any> = {}) => {
      const client = clientRef.current;
      if (!client?.active) return;
      client.publish({ destination, body: JSON.stringify(body) });
    },
    [], // 4. Añadimos el array de dependencias al useCallback
  );

  const disconnect = useCallback(() => {
    const client = clientRef.current;
    if (client?.active) {
      client.deactivate();
      subscriptionsRef.current.clear();
      clientRef.current = null;
      console.log('WebSocket desconectado');
    }
  }, []); // 4. Añadimos el array de dependencias al useCallback

  return { connect, subscribe, send, disconnect };
};
