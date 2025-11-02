import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { AppRouter } from '@/routes/AppRoutes';

// 1. Creamos la instancia del cliente aquí (movido de main.tsx)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    // 2. Envolvemos todo con los providers
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* 3. Renderizamos el enrutador */}
        <AppRouter />
        {/* 4. Mantenemos el ToastContainer aquí */}
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
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
