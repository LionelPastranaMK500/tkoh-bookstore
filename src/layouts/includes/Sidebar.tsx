// src/layouts/includes/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Briefcase,
  Users,
  User,
  MessageSquare,
  ScrollText,
  ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '@/services/auth/authStore';

export function Sidebar() {
  // Obtener el usuario y sus roles del store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRoles = useAuthStore(
    (state) => state.user?.roles.map((r) => r.nombreRol) || [],
  );

  // Clase helper para NavLink
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary ${
      isActive ? 'text-primary bg-muted' : ''
    }`;

  const canShow = (roles: string[]) => {
    return roles.some((r) => userRoles.includes(r));
  };

  const showAdminSection = canShow(['ADMIN', 'OWNER']);

  return (
    <aside className="sticky top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:block">
      <div className="h-full py-6 pl-8 pr-6 lg:py-8">
        <nav className="flex flex-col gap-1">
          {/* --- Grupo 1: Gestión (Todos los usuarios autenticados) --- */}
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

          {/* Categorías y Editoriales. 
            Según tus rutas, están protegidas por 'CATEGORY_READ_ALL', 
            así que las aseguramos con canShow.
          */}
          {canShow(['OWNER', 'ADMIN']) && (
            <NavLink to="/categorias" className={navLinkClass}>
              <Tags className="h-4 w-4" />
              Categorías
            </NavLink>
          )}

          {/* Editoriales es accesible por todos los autenticados */}
          <NavLink to="/editoriales" className={navLinkClass}>
            <Briefcase className="h-4 w-4" />
            Editoriales
          </NavLink>

          {/* Tareas (Vendedor, Admin, Owner) */}
          {canShow(['VENDEDOR', 'ADMIN', 'OWNER']) && (
            <NavLink to="/tareas" className={navLinkClass}>
              <ClipboardList className="h-4 w-4" />
              Tareas
            </NavLink>
          )}

          {/* Mensajería (Todos los autenticados) */}
          {isAuthenticated && (
            <NavLink to="/chat" className={navLinkClass}>
              <MessageSquare className="h-4 w-4" />
              Mensajería
            </NavLink>
          )}

          {/* --- Grupo 2: Administración (Solo Admin y Owner) --- */}
          {showAdminSection && (
            <>
              <span className="mt-4 mb-2 text-xs font-semibold uppercase text-muted-foreground/80">
                Administración
              </span>

              <NavLink to="/admin/users" className={navLinkClass}>
                <Users className="h-4 w-4" />
                Gestionar Usuarios
              </NavLink>

              <NavLink to="/admin/logs" className={navLinkClass}>
                <ScrollText className="h-4 w-4" />
                Logs de Auditoría
              </NavLink>
            </>
          )}

          {/* --- Grupo 3: Perfil (Separado) --- */}
          <span className="mt-4 mb-2 text-xs font-semibold uppercase text-muted-foreground/80">
            Cuenta
          </span>
          <NavLink to="/perfil" className={navLinkClass}>
            <User className="h-4 w-4" />
            Mi Perfil
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
