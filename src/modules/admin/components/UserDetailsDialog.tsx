import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { useUser } from '@/services/admin/userApi';
import { Loader2, AlertCircle } from 'lucide-react';
import type { User } from '@/services/types/User';

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number | null;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <div className="text-sm text-foreground text-left sm:text-right">
      {children}
    </div>
  </div>
);

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  onOpenChange,
  userId,
}) => {
  const { data: apiResponse, isLoading, error } = useUser(userId ?? 0);
  const user: User | undefined = apiResponse?.data;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Cargando detalles...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-48 flex-col items-center justify-center text-destructive">
          <AlertCircle className="mr-2 h-8 w-8" />
          <span className="font-medium">Error al cargar el usuario</span>
          <p className="text-sm">{error.message}</p>
        </div>
      );
    }

    if (user) {
      return (
        <div className="space-y-4 py-4">
          <DetailItem label="ID de Usuario">{user.id}</DetailItem>
          <DetailItem label="Nombre de Usuario">
            {user.nombreUsuario}
          </DetailItem>
          <DetailItem label="Email">{user.email}</DetailItem>
          <DetailItem label="Celular">
            {user.celular || 'No registrado'}
          </DetailItem>
          <DetailItem label="Fecha de Registro">
            {new Date(user.fechaRegistro).toLocaleString()}
          </DetailItem>
          <DetailItem label="Roles">
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              {user.roles.map((rol) => (
                <Badge key={rol.id} variant="secondary">
                  {rol.nombreRol}
                </Badge>
              ))}
            </div>
          </DetailItem>
          <DetailItem label="Estado de Cuenta">
            <Badge variant={user.enabled ? 'default' : 'destructive'}>
              {user.enabled ? 'Habilitado' : 'Deshabilitado'}
            </Badge>
          </DetailItem>
          <DetailItem label="Cuenta Bloqueada">
            <Badge variant={!user.accountNonLocked ? 'destructive' : 'default'}>
              {!user.accountNonLocked ? 'Sí' : 'No'}
            </Badge>
          </DetailItem>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
          <DialogDescription>
            Información detallada de la cuenta de usuario.
          </DialogDescription>
        </DialogHeader>

        {/* --- 6. Renderizar el contenido (carga, error o éxito) --- */}
        {renderContent()}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
