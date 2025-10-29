// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';

// Este componente envuelve a las páginas principales
// y renderiza las rutas hijas (HomePage, UserProfilePage, etc.)
// donde sea que coloques el <Outlet />.
export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Puedes poner aquí un Navbar o Header */}
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-lg">Studios Tkoh!</h1>
        {/* Aquí irían links de navegación */}
      </header>
      {/* El Outlet renderiza el componente de la ruta hija */}
      <main className="flex-4 p-4">
        <Outlet />
      </main>
      {/* Puedes poner aquí un Footer */}
      <footer className="bg-gray-200 p-4 text-center">© 2025 Bookstore</footer>
    </div>
  );
};
