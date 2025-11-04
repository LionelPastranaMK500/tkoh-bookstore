import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { BookMarked, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/services/auth/authStore';
import { Navbar } from './Navbar';
import { useThemeStore } from '@/shared/stores/themeStore';

export function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="top-0 z-50 sticky bg-background/95 backdrop-blur border-border/40 border-b w-full">
      <div className="flex items-center h-14 container">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <BookMarked className="w-6 h-6 text-primary" />
          <span className="sm:inline-block font-bold">TKOH Bookstore</span>
        </Link>

        {/* --- 2. USAMOS EL NAVBAR --- */}
        {/* Solo mostrar el Navbar si estamos en la HomePage */}
        {currentPath === '/' ? <Navbar /> : <div className="flex-1" />}

        {/* Botones de Autenticación (Derecha) */}
        <div className="flex items-center space-x-2">
          {/* 4. Añadir el botón para cambiar tema */}
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>

          {isAuthenticated ? (
            <Button asChild>
              <Link to="/perfil">
                <LayoutDashboard className="mr-2 w-4 h-4" />
                Ir al Panel
              </Link>
            </Button>
          ) : (
            <>
              {currentPath !== '/login' && (
                <Button variant="outline" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
              )}
              {currentPath !== '/register' && (
                <Button asChild>
                  <Link to="/register">Registrarse</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
