import { Outlet } from 'react-router-dom';
import { Footer } from './includes/Footer';
import { Header } from './includes/Header';
import { Sidebar } from './includes/Sidebar';

export default function MainLayout() {
  return (
    <div className="relative flex flex-col bg-background min-h-screen">
      <Header />
      <div className="flex-1 items-start md:gap-6 lg:gap-10 md:grid md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)] container">
        <Sidebar />
        <main className="relative py-6 lg:py-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
