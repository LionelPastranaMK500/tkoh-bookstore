// src/modules/chat/components/SalaDeChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStomp } from '@/contexts/StompContext';
import {
  useMensajes,
  useEnviarMensaje,
} from '@/services/mensajeria/conversacionApi';
import type { MensajeDto } from '@/services/types/simple/MensajeDto';
import {
  mensajeCreateSchema,
  type MensajeCreateFormValues,
} from '@/services/types/conversacion/MensajeCreateSchema';
import { type IMessage } from '@stomp/stompjs'; // <-- 1. IMPORTAR 'IMessage' AQUÍ
import { toast } from 'react-toastify'; // <-- 2. IMPORTAR 'toast'

import { MensajeItem } from './MensajeItem';
import { Loader2, AlertCircle, Send } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';

// ... (resto del código de SalaDeChat.tsx sin cambios)
interface SalaDeChatProps {
  conversacionId: number | null;
}

export const SalaDeChat: React.FC<SalaDeChatProps> = ({ conversacionId }) => {
  const [mensajes, setMensajes] = useState<MensajeDto[]>([]);
  const { stompClient, isConnected } = useStomp();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 1. Hook de React Query para cargar el historial
  const {
    data: historialQuery,
    isLoading,
    error,
  } = useMensajes(conversacionId ?? 0);

  // 2. Hook de React Query para enviar mensajes (vía POST)
  const { mutate: enviarMensaje, isPending: isSending } = useEnviarMensaje();

  // 3. Cargar el historial en el estado local cuando la query se complete
  useEffect(() => {
    if (historialQuery?.data) {
      setMensajes(historialQuery.data);
    }
  }, [historialQuery]);

  // 4. Suscripción a WebSockets
  useEffect(() => {
    if (isConnected && stompClient && conversacionId) {
      console.log(
        `[STOMP] Suscribiendo a /topic/conversacion/${conversacionId}`,
      );

      const subscription = stompClient.subscribe(
        `/topic/conversacion/${conversacionId}`,
        (message: IMessage) => {
          // <-- TIPO USADO AQUÍ
          try {
            const nuevoMensaje = JSON.parse(message.body) as MensajeDto;
            console.log('[STOMP] Mensaje recibido:', nuevoMensaje);

            // Añadir el nuevo mensaje al estado
            setMensajes((prevMensajes) => [...prevMensajes, nuevoMensaje]);
          } catch (e) {
            console.error('Error al parsear mensaje de WebSocket', e);
          }
        },
      );

      // Función de limpieza: desuscribirse cuando el ID cambie o se desmonte
      return () => {
        console.log(
          `[STOMP] Desuscribiendo de /topic/conversacion/${conversacionId}`,
        );
        subscription.unsubscribe();
      };
    }
  }, [isConnected, stompClient, conversacionId]);

  // 5. Scroll automático al fondo
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
      });
    }
  }, [mensajes]);

  // 6. Formulario para enviar mensaje
  const form = useForm<MensajeCreateFormValues>({
    resolver: zodResolver(mensajeCreateSchema),
    defaultValues: { cuerpoMensaje: '' },
  });

  const onSubmit = (values: MensajeCreateFormValues) => {
    if (!conversacionId) return;

    enviarMensaje(
      { conversacionId, mensajeData: values },
      {
        onSuccess: () => {
          form.reset(); // Limpiar input
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Error al enviar');
        },
      },
    );
  };

  // --- Renderizado ---
  // ... (el resto del JSX es idéntico)
  if (!conversacionId) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
        <p>Selecciona una conversación</p>
        <p className="text-sm">o inicia una nueva.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        <AlertCircle className="mr-2" /> Error al cargar mensajes.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 1. Área de Mensajes */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {mensajes.map((msg) => (
            <MensajeItem key={msg.id} mensaje={msg} />
          ))}
        </div>
      </ScrollArea>

      {/* 2. Formulario de Envío */}
      <div className="border-t p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <FormField
              control={form.control}
              name="cuerpoMensaje"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Escribe un mensaje..."
                      autoComplete="off"
                      {...field}
                      disabled={!isConnected || isSending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!isConnected || isSending}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </Form>
        {!isConnected && (
          <p className="text-xs text-destructive text-center mt-2">
            Conectando al chat en tiempo real...
          </p>
        )}
      </div>
    </div>
  );
};
