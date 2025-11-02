import { NavLink } from 'react-router-dom';

/**
 * Sidebar para el layout principal (privado).
 * Se mostrará cuando el usuario esté autenticado.
 * TODO: La lógica de qué enlaces mostrar (basado en roles) irá aquí.
 */
export function Sidebar() {
  // Estilo base para los NavLinks
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium text-muted-foreground transition-colors hover:text-primary ${
      isActive ? 'text-primary' : ''
    }`;

  return (
    <aside className="sticky top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:block">
      <div className="h-full py-6 pl-8 pr-6 lg:py-8">
        <nav className="flex flex-col gap-3">
          <span className="mb-2 text-lg font-semibold text-primary">Menú</span>

          {/* Enlaces de ejemplo */}
          <NavLink to="/perfil" className={navLinkClass}>
            Mi Perfil
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Gestión de Usuarios
          </NavLink>
          <NavLink to="/owner" className={navLinkClass}>
            Panel de Dueño
          </NavLink>
          <NavLink to="/vendedor" className={navLinkClass}>
            Panel de Vendedor
          </NavLink>
          {/* Agregaremos más enlaces aquí */}
        </nav>
      </div>
    </aside>
  );
}
