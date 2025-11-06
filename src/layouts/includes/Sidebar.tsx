// src/layouts/includes/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Briefcase,
  Users,
  User,
  MessageSquare, // <-- 1. IMPORTAR ÍCONO DE CHAT
} from 'lucide-react';
import { useAuthStore } from '@/services/auth/authStore';
// ...

export function Sidebar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // ...
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary ${
      isActive ? 'text-primary bg-muted' : ''
    }`;

  // ... (lógica de canShow)
  const canShow = (roles: string[]) => {
    console.log('Roles requeridos:', roles);
    return isAuthenticated; // O simplemente 'true' por ahora
  };

  return (
    <aside className="sticky top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:block">
      <div className="h-full py-6 pl-8 pr-6 lg:py-8">
        <nav className="flex flex-col gap-1">
          {/* --- Grupo 1: Gestión (del JSF) --- */}
          <span className="mb-2 text-xs font-semibold uppercase text-muted-foreground/80">
            Gestión
          </span>
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/libros" className={navLinkClass}>
            <BookOpen className="h-4 w-4" />
            Libros
          </NavLink>
          <NavLink to="/categorias" className={navLinkClass}>
            <Tags className="h-4 w-4" />
            Categorías
          </NavLink>
          <NavLink to="/editoriales" className={navLinkClass}>
            <Briefcase className="h-4 w-4" />
            Editoriales
          </NavLink>

          {/* --- 2. AÑADIR ENLACE AL CHAT --- */}
          {isAuthenticated && (
            <NavLink to="/chat" className={navLinkClass}>
              <MessageSquare className="h-4 w-4" />
              Mensajería
            </NavLink>
          )}

          {/* --- Grupo 2: Administración (Tu lógica) --- */}
          <span className="mt-4 mb-2 text-xs font-semibold uppercase text-muted-foreground/80">
            Administración
          </span>

          {/* ... (resto de enlaces: Gestionar Usuarios, Mi Perfil) ... */}
          {canShow(['ADMIN', 'OWNER']) && (
            <NavLink to="/admin/users" className={navLinkClass}>
              <Users className="h-4 w-4" />
              Gestionar Usuarios
            </NavLink>
          )}

          <NavLink to="/perfil" className={navLinkClass}>
            <User className="h-4 w-4" />
            Mi Perfil
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
