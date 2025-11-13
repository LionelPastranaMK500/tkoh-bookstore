// src/modules/Home/pages/HomePage.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import {
  BookOpenCheck,
  Zap,
  Cog,
  ShieldCheck,
  Target, // Para Misión
  Eye, // Para Visión
  LayoutGrid, // Para Servicios
  Building, // Para Información
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <section className="container relative py-20 md:py-32 lg:py-40">
        <div className="mx-auto flex flex-col items-center justify-center text-center">
          <BookOpenCheck className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Bienvenido a TKOH Bookstore
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Tu solución integral y moderna para la gestión avanzada de
            librerías. Controla tu inventario, ventas y equipo, todo desde un
            solo lugar.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/login">Comenzar a Gestionar</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/register">Crear una cuenta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- CORRECCIÓN: Sección de Información (id="info") --- */}
      <section id="info" className="w-full py-20 md:py-24 bg-secondary/30">
        {/* 'max-w-5xl' FUE ELIMINADO de este div */}
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <Building className="inline-block h-8 w-8 mr-3" />
            Información de <span className="text-primary">Studios TKOH!</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Identidad Legal
              </h3>
              <p className="text-muted-foreground">
                <strong>RUC:</strong> 12345678901
              </p>
              <p className="text-muted-foreground">
                <strong>Dirección:</strong> Av. Siempre Viva 123
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Especialización
              </h3>
              <p className="text-muted-foreground">
                Desarrollo de Software a Medida
              </p>
              <p className="text-muted-foreground">Soluciones Web y Móviles</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORRECCIÓN: Sección Misión/Visión (id="mision-vision") --- */}
      <section id="mision-vision" className="container py-20 md:py-24">
        {/* 'max-w-5xl' FUE ELIMINADO de este div */}
        <div className="mx-auto grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Misión */}
          <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
            <Target className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-2xl font-semibold">Nuestra Misión</h3>
            <p className="mt-2 text-muted-foreground">
              Proveer soluciones tecnológicas innovadoras que impulsen el
              crecimiento y la eficiencia de nuestros clientes.
            </p>
          </div>
          {/* Visión */}
          <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
            <Eye className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-2xl font-semibold">Nuestra Visión</h3>
            <p className="mt-2 text-muted-foreground">
              Ser la empresa líder en transformación digital en la región,
              reconocida por nuestra calidad, compromiso y adaptabilidad.
            </p>
          </div>
        </div>
      </section>

      {/* --- CORRECCIÓN: Sección de Servicios (id="servicios") --- */}
      <section id="servicios" className="w-full py-20 md:py-24 bg-secondary/30">
        {/* 'max-w-5xl' FUE ELIMINADO de este div */}
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <LayoutGrid className="inline-block h-8 w-8 mr-3" />
            Nuestras Soluciones
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
              <Zap className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Gestión Rápida</h3>
              <p className="mt-2 text-muted-foreground">
                Sistemas de inventario y ventas veloces.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
              <ShieldCheck className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Control de Acceso</h3>
              <p className="mt-2 text-muted-foreground">
                Roles y permisos robustos para tu equipo.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
              <Cog className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Nivel Empresarial</h3>
              <p className="mt-2 text-muted-foreground">
                Impulsado por APIs potentes y escalables.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
