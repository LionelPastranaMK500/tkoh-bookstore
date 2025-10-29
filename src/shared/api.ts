import axios from 'axios';

// Este es un placeholder temporal.
// Será reemplazado por el código del Paso 3.2 de la guía (con interceptores).
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

// Asegúrate de tener tu archivo .env.local en la raíz con:
// VITE_API_BASE_URL=http://localhost:8080/api
