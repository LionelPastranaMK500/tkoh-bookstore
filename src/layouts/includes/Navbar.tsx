import React from 'react';

const scrollToSection = (
  e: React.MouseEvent<HTMLAnchorElement>,
  sectionId: string,
) => {
  e.preventDefault();

  if (sectionId === 'top') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    return;
  }

  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 80,
      behavior: 'smooth',
    });
  }
};

export function Navbar() {
  return (
    <nav className="hidden md:flex flex-1 items-center space-x-6">
      {/* --- ENLACE AÑADIDO --- */}
      <a
        href="#" // href="#" es convencional para "top"
        onClick={(e) => scrollToSection(e, 'top')}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        Home
      </a>

      <a
        href="#info"
        onClick={(e) => scrollToSection(e, 'info')}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        Información
      </a>
      <a
        href="#mision-vision"
        onClick={(e) => scrollToSection(e, 'mision-vision')}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        Misión y Visión
      </a>
      <a
        href="#servicios"
        onClick={(e) => scrollToSection(e, 'servicios')}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        Soluciones
      </a>
    </nav>
  );
}
