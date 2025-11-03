// src/App.tsx
import { ToastContainer } from 'react-toastify';
import { AppRouter } from './routes/AppRoutes'; // Ruta relativa

// --- IMPORTS DE ESTILO ---
// Siguiendo el patrón de sistema-de-gestion/src/App.jsx
import 'react-toastify/dist/ReactToastify.css'; // Toastify (ruta corregida)
// Los otros estilos se movieron a main.tsx

function App() {
  return (
    <>
      {/* AppRouter ya no está comentado.
QueryClientProvider se quitó como pediste.
*/}
      <AppRouter />

      {/* Mantenemos el ToastContainer aquí */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
