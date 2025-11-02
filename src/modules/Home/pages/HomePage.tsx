import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { BookOpenCheck, Zap, Cog, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Sección Hero */}
      <section className="container relative py-20 md:py-32 lg:py-40">
        <div className="mx-auto flex max-w-[64rem] flex-col items-center justify-center text-center">
          <BookOpenCheck className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Bienvenido a TKOH Bookstore
          </h1>
          <p className="mt-4 max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
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

      {/* Sección de Características */}
      <section className="container py-20 md:py-24 bg-secondary/30">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <Zap className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">
              Gestión Rápida y Moderna
            </h3>
            <p className="mt-2 text-muted-foreground">
              Administra tu inventario, categorías y editoriales con una
              interfaz veloz construida con React y Tailwind.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">
              Control de Acceso Total
            </h3>
            <p className="mt-2 text-muted-foreground">
              Sistema robusto de Roles (Owner, Admin, Vendedor) y permisos
              granulares para tu equipo, todo asegurado con JWT.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Cog className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">
              Desarrollo Profesional
            </h3>
            <p className="mt-2 text-muted-foreground">
              Una aplicación de nivel empresarial impulsada por una potente API
              de Spring Boot 3.
            </p>
          </div>
        </div>

        {/* Publicidad de Studios TKOH! */}
        <div className="mt-16 text-center text-muted-foreground">
          <p>
            Desarrollado con orgullo por{' '}
            <a
              href="https" // TODO: Poner tu enlace
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-4"
            >
              Studios TKOH!
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
