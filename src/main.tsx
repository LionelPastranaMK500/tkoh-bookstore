import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa el App.tsx actualizado
import '@/styles/index.css'; // Estilos globales
import 'primereact/resources/themes/aura-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'react-toastify/dist/ReactToastify.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
