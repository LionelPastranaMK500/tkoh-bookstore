import { Outlet } from 'react-router-dom';
import { Footer } from './includes/Footer';
import { Header } from './includes/Header';
import { Sidebar } from './includes/Sidebar';

/**
 * Layout para las páginas privadas (Dashboard, Admin, etc.)
 * Tiene un Header, Sidebar, Footer y un <Outlet> para el contenido.
 * Logra la experiencia "unipaginal" (SPA).
 */
export default function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
        <Sidebar />
        <main className="relative py-6 lg:py-8">
          {/* Aquí se renderiza el contenido dinámico privado (AdminPage, etc.) */}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
