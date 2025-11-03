import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { BookMarked, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/services/auth/authStore';

/**
 * Navbar para las páginas públicas (Home, Login, etc.)
 * Muestra "Login" o "Ir al Panel" según el estado de autenticación.
 */
export function Navbar() {
  // 1. Leer el estado de autenticación de Zustand
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <header className="top-0 z-50 sticky bg-background/95 backdrop-blur border-border/40 border-b w-full">
      <div className="flex items-center max-w-screen-2xl h-14 container">
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <BookMarked className="w-6 h-6 text-primary" />
          <span className="sm:inline-block font-bold">TKOH Bookstore</span>
        </Link>
        <div className="flex-1" /> {/* Espaciador */}
        <div className="flex items-center space-x-2">
          {/* 2. Renderizado condicional */}
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/perfil">
                {' '}
                {/* Ruta por defecto al entrar */}
                <LayoutDashboard className="mr-2 w-4 h-4" />
                Ir al Panel
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
