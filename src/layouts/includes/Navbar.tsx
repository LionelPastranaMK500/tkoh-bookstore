import React from 'react';

// Función para scroll suave
const scrollToSection = (
  e: React.MouseEvent<HTMLAnchorElement>,
  sectionId: string,
) => {
  e.preventDefault();

  // --- CAMBIO: Caso especial para "top" (Home) ---
  if (sectionId === 'top') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    return; // Salir de la función aquí
  }

  // Lógica existente para otras secciones
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 80, // Ajustar por la altura del header
      behavior: 'smooth',
    });
  }
};

/**
 * Componente que renderiza SOLO los enlaces de navegación
 * para las secciones de la HomePage.
 */
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
      {/* --- FIN DE ENLACE AÑADIDO --- */}

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
