// src/modules/admin/components/AssignRolesDialog.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/services/auth/authStore';
import {
  useUser,
  useRoles,
  useAssignUserRoles,
} from '@/services/admin/userApi';
import type { UsuarioDto } from '@/services/types/simple/UsuarioDto';
import type { RoleDto } from '@/services/types/role';

// Importar componentes de Shadcn/UI
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

interface AssignRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UsuarioDto | null; // El usuario de la tabla
  onRolesUpdated: () => void; // Para refrescar la tabla
}

export const AssignRolesDialog: React.FC<AssignRolesDialogProps> = ({
  open,
  onOpenChange,
  user,
  onRolesUpdated,
}) => {
  // 1. Hook de mutación para ENVIAR la actualización
  const { mutate: assignRoles, isPending: isAssigning } = useAssignUserRoles();

  // 2. Obtener el usuario autenticado (el admin/owner)
  const adminUser = useAuthStore((state) => state.user);
  const isOwner =
    adminUser?.roles.some((r) => r.nombreRol === 'OWNER') ?? false;

  // 3. Obtener los datos frescos del *usuario a editar* (para saber sus roles actuales)
  const {
    data: userQuery,
    isLoading: isLoadingUser,
    error: userError,
  } = useUser(user?.id ?? 0);
  const usuarioAEditar = userQuery?.data;

  // 4. Obtener todos los roles disponibles
  const {
    data: rolesQuery,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useRoles();
  const allRoles: RoleDto[] = rolesQuery?.data?.content ?? [];

  // 5. Estado para manejar los IDs de roles seleccionados
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(
    new Set(),
  );

  // 6. Efecto para inicializar los checkboxes cuando los datos del usuario cargan
  useEffect(() => {
    if (usuarioAEditar?.roles) {
      const currentRoleIds = new Set(usuarioAEditar.roles.map((r) => r.id));
      setSelectedRoleIds(currentRoleIds);
    }
  }, [usuarioAEditar?.roles, open]); // Resetear al abrir/cambiar de usuario

  // 7. Manejador para el cambio de checkbox
  // onCheckedChange de Shadcn puede devolver boolean o 'indeterminate'
  const handleRoleChange = (
    roleId: number,
    checked: boolean | 'indeterminate',
  ) => {
    setSelectedRoleIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (checked === true) {
        newIds.add(roleId);
      } else {
        newIds.delete(roleId);
      }
      return newIds;
    });
  };

  // 8. Lógica de Submit
  const onSubmit = () => {
    if (!user) return;

    toast.info('Asignando roles...');
    assignRoles(
      {
        userId: user.id,
        roleIds: Array.from(selectedRoleIds),
      },
      {
        onSuccess: (data) => {
          toast.success(`Roles actualizados para "${data.data.nombreUsuario}"`);
          onRolesUpdated(); // Refresca la tabla
          onOpenChange(false); // Cierra el modal
        },
        onError: (error: any) => {
          const apiError =
            error.response?.data?.message || 'No se pudo asignar los roles.';
          toast.error(apiError);
        },
      },
    );
  };

  // 9. Renderizado condicional del contenido
  const renderContent = () => {
    if (isLoadingUser || isLoadingRoles) {
      return (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Cargando datos...</span>
        </div>
      );
    }

    if (userError || rolesError) {
      return (
        <div className="flex h-48 flex-col items-center justify-center text-destructive">
          <AlertCircle className="mr-2 h-8 w-8" />
          <span className="font-medium">Error al cargar datos</span>
          <p className="text-sm">{userError?.message || rolesError?.message}</p>
        </div>
      );
    }

    // Si no hay carga y no hay error, mostrar el formulario
    return (
      <div className="space-y-4 py-4">
        {allRoles.map((role) => {
          // Lógica de negocio de la API:
          // Un ADMIN no puede asignar OWNER o ADMIN.
          const isDisabled =
            !isOwner &&
            (role.nombreRol === 'OWNER' || role.nombreRol === 'ADMIN');

          return (
            <div
              key={role.id}
              className={`flex items-center space-x-3 rounded-md border p-3 ${
                isDisabled ? 'bg-muted/50 opacity-60' : 'hover:bg-accent/50'
              }`}
            >
              {/* --- CORRECCIÓN --- 
                  Usar el componente Checkbox importado en lugar de SimpleCheckbox */}
              <Checkbox
                id={`role-${role.id}`}
                checked={selectedRoleIds.has(role.id)}
                onCheckedChange={(checked) =>
                  handleRoleChange(role.id, checked)
                }
                disabled={isDisabled || isAssigning}
              />
              <Label
                htmlFor={`role-${role.id}`}
                className={`flex flex-col ${
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <span className="font-semibold text-foreground">
                  {role.nombreRol}
                </span>
                <span className="text-sm text-muted-foreground">
                  {role.descripcion}
                </span>
                {isDisabled && (
                  <span className="text-xs text-destructive">
                    (Solo disponible para Owners)
                  </span>
                )}
              </Label>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Asignar Roles
          </DialogTitle>
          <DialogDescription>
            Gestiona los roles para el usuario{' '}
            <span className="font-medium text-foreground">
              {user?.nombreUsuario}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {renderContent()}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isAssigning || isLoadingUser || isLoadingRoles}
          >
            {isAssigning ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
