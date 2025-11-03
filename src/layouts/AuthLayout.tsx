import { Outlet } from 'react-router-dom';
import { Footer } from './includes/Footer';
import { Header } from './includes/Header';

export function AuthLayout() {
  return (
    <div className="relative flex flex-col bg-background min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
