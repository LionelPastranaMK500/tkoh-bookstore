// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

// 1. Importa el cliente y el proveedor de React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. Crea una instancia del cliente
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. Envuelve toda tu aplicación con el proveedor */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
