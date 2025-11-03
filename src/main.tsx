// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import App from './App'; // Ruta relativa

// --- STYLES ---
// Siguiendo el patrón de 'sistema-de-gestion/main.jsx'
import 'primereact/resources/primereact.min.css'; // Core
import 'primeicons/primeicons.css'; // Iconos
import './styles/primereact-styles.css'; // Tema (Archivo nuevo)
import './styles/index.css'; // Tailwind/Globales

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PrimeReactProvider>
  </React.StrictMode>,
);
