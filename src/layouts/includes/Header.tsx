import { BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Header para el layout principal (privado).
 * Se mostrará cuando el usuario esté autenticado.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link to="/perfil" className="flex items-center space-x-2">
            <BookMarked className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">TKOH Bookstore</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {/* TODO: Aquí irá el Menú de Usuario (Avatar, Salir) */}
            <p className="text-sm font-medium">Usuario Logueado</p>
          </nav>
        </div>
      </div>
    </header>
  );
}
