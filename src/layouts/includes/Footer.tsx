import { Github, Linkedin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {

  const logoUrl = '/Logo_STKH.png';

  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 text-center md:text-left">
          {/* 1. Información de la Empresa */}
          <div className="flex flex-col gap-3 max-w-sm md:w-1/3">
            <Link
              to="/"
              className="flex items-center justify-center md:justify-start gap-2 mb-2"
            >
              <img
                src={logoUrl}
                alt="Logo Studios TKOH!"
                className="h-9 w-auto rounded-md"
              />
              <span className="text-xl font-bold text-foreground">
                Studios TKOH!
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong>Innovación en desarrollo de software.</strong>
              Creamos soluciones a medida para potenciar tu negocio, desde
              aplicaciones web hasta sistemas de gestión complejos como este
              Bookstore.
            </p>
          </div>

          {/* 2. Navegación Rápida */}
          <div className="flex flex-col gap-2 md:w-1/3">
            <h4 className="font-semibold text-foreground mb-2">Servicios</h4>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Desarrollo Web
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Aplicaciones Móviles
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Consultoría UX/UI
            </a>
          </div>

          {/* 3. Redes y Contacto (CON ICONOS) */}
          <div className="flex flex-col gap-2 md:w-1/3">
            <h4 className="font-semibold text-foreground mb-2">Conecta</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="https://github.com/LavenderEdit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub de Studios TKOH!"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn de Studios TKOH!"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://studios-tkoh.azurewebsites.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Sitio Web de Studios TKOH!"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* --- Sub-Footer (Copyright del Producto) --- */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TKOH Bookstore. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Un producto de{' '}
            <a
              href="https://studios-tkoh.azurewebsites.net"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Studios TKOH!
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
