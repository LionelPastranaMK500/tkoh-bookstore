import { Outlet } from 'react-router-dom';
import { Footer } from './includes/Footer';
import { Navbar } from './includes/Navbar';

export function AuthLayout() {
  return (
    <div className="relative flex flex-col bg-background min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
