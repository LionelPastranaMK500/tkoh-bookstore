// src/layouts/includes/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
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
  LogOut, // 2. Importar el ícono
} from 'lucide-react';
import { useAuthStore } from '@/services/auth/authStore';
import { useMemo } from 'react'; // Importar useMemo (de la corrección anterior)

export function Sidebar() {
  // 3. Obtener el hook de navegación y la función de logout
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // --- Lógica de roles (de la corrección anterior) ---
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const roles = useAuthStore((state) => state.user?.roles);
  const userRoles = useMemo(
    () => roles?.map((r) => r.nombreRol) || [],
    [roles],
  );
  // --- Fin lógica de roles ---

  // Clase helper para NavLink
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary ${
      isActive ? 'text-primary bg-muted' : ''
    }`;

  const canShow = (roles: string[]) => {
    return roles.some((r) => userRoles.includes(r));
  };

  const showAdminSection = canShow(['ADMIN', 'OWNER']);

  // 3. Función para manejar el logout
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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

          {canShow(['OWNER', 'ADMIN']) && (
            <NavLink to="/categorias" className={navLinkClass}>
              <Tags className="h-4 w-4" />
              Categorías
            </NavLink>
          )}

          <NavLink to="/editoriales" className={navLinkClass}>
            <Briefcase className="h-4 w-4" />
            Editoriales
          </NavLink>

          {canShow(['VENDEDOR', 'ADMIN', 'OWNER']) && (
            <NavLink to="/tareas" className={navLinkClass}>
              <ClipboardList className="h-4 w-4" />
              Tareas
            </NavLink>
          )}

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

          {/* 4. AÑADIR EL BOTÓN DE LOGOUT AQUÍ */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </aside>
  );
}
