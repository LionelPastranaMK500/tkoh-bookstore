import { Outlet } from 'react-router-dom';
import { Footer } from './includes/Footer';
import { Navbar } from './includes/Navbar';

/**
 * Layout para las páginas públicas (Home, Login, Register, etc.)
 * Tiene un Navbar público y un Footer.
 */
export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      {/* Contenido principal (HomePage, LoginPage, etc.) */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
