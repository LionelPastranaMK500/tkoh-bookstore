import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { AppRouter } from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
import { useThemeStore } from '@/shared/stores/themeStore';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <>
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
        theme={theme}
      />
    </>
  );
}

export default App;
