/**
 * Footer compartido para todos los layouts
 */
export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} TKOH Bookstore. Todos los derechos
          reservados.
        </p>
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-right">
          Desarrollado por{' '}
          <a
            href="https" // TODO: Poner tu enlace
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Studios TKOH!
          </a>
        </p>
      </div>
    </footer>
  );
}
