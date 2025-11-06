// src/shared/stores/notificacionStore.ts
import { create } from 'zustand';
import type { NotificacionDto } from '@/services/types/simple/NotificacionDto';

interface NotificacionState {
  notificaciones: NotificacionDto[];
  noLeidasCount: number;
  setNotificaciones: (notificaciones: NotificacionDto[]) => void;
  addNotificacion: (notificacion: NotificacionDto) => void;
  markAsReadInStore: (id: number) => void;
  removeFromStore: (id: number) => void;
  clearNotificaciones: () => void;
}

const calcularNoLeidas = (notificaciones: NotificacionDto[]) => {
  return notificaciones.filter((n) => !n.leido).length;
};

export const useNotificacionStore = create<NotificacionState>((set) => ({
  notificaciones: [],
  noLeidasCount: 0,

  // Acción para inicializar el store con datos de la API
  setNotificaciones: (notificaciones) =>
    set({
      notificaciones: notificaciones.sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() -
          new Date(a.fechaCreacion).getTime(),
      ),
      noLeidasCount: calcularNoLeidas(notificaciones),
    }),

  // Acción para añadir una nueva notificación (desde WebSocket)
  addNotificacion: (notificacion) =>
    set((state) => ({
      // Añadir al inicio de la lista
      notificaciones: [notificacion, ...state.notificaciones],
      noLeidasCount: state.noLeidasCount + 1,
    })),

  // Acción para marcar una como leída (después del éxito de la API)
  markAsReadInStore: (id) =>
    set((state) => {
      const nuevasNotificaciones = state.notificaciones.map((n) =>
        n.id === id ? { ...n, leido: true } : n,
      );
      return {
        notificaciones: nuevasNotificaciones,
        noLeidasCount: calcularNoLeidas(nuevasNotificaciones),
      };
    }),

  // Acción para eliminar una (después del éxito de la API)
  removeFromStore: (id) =>
    set((state) => {
      const nuevasNotificaciones = state.notificaciones.filter(
        (n) => n.id !== id,
      );
      return {
        notificaciones: nuevasNotificaciones,
        noLeidasCount: calcularNoLeidas(nuevasNotificaciones),
      };
    }),

  // Acción para limpiar al hacer logout
  clearNotificaciones: () =>
    set({
      notificaciones: [],
      noLeidasCount: 0,
    }),
}));
