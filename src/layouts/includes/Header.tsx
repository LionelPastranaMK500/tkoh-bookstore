import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { BookMarked, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/services/auth/authStore';
import { Navbar } from './Navbar'; // <-- 1. IMPORTAMOS EL NAVBAR

/**
 * Header (Público)
 * Contiene el Logo, el Navbar (links de secciones) y los botones de Auth.
 */
export function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <header className="top-0 z-50 sticky bg-background/95 backdrop-blur border-border/40 border-b w-full">
      <div className="flex items-center max-w-screen-2xl h-14 container">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <BookMarked className="w-6 h-6 text-primary" />
          <span className="sm:inline-block font-bold">TKOH Bookstore</span>
        </Link>

        {/* --- 2. USAMOS EL NAVBAR --- */}
        {/* Solo mostrar el Navbar si estamos en la HomePage */}
        {currentPath === '/' ? (
          <Navbar />
        ) : (
          <div className="flex-1" /> // Espaciador en /login y /register
        )}

        {/* Botones de Autenticación (Derecha) */}
        <div className="flex items-center space-x-2">
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
