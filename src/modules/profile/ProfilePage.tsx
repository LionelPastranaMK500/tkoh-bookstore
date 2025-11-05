// src/modules/profile/ProfilePage.tsx
import React from 'react';
import { useMyProfile } from '@/services/profile/profileApi';
import { ProfileUpdateForm } from './components/ProfileUpdateForm';
import { PasswordChangeForm } from './components/PasswordChangeForm';

import { Loader2, AlertCircle, Mail, Clock, Shield } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

export const ProfilePage: React.FC = () => {
  const { data: profileQuery, isLoading, error } = useMyProfile();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        <span className="text-muted-foreground">Cargando perfil...</span>
      </div>
    );
  }

  if (error || !profileQuery?.data) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-destructive">
        <AlertCircle className="mr-2 h-8 w-8" />
        <span className="font-medium">Error al cargar el perfil</span>
        <p className="text-sm">
          {error?.message || 'No se pudieron obtener los datos.'}
        </p>
      </div>
    );
  }

  const user = profileQuery.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>

      {/* Grid para los formularios y la información */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna 1: Formulario de Perfil */}
        <div className="lg:col-span-2">
          <ProfileUpdateForm user={user} />
        </div>

        {/* Columna 2: Información Estática */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Cuenta</CardTitle>
              <CardDescription>
                Estos datos no se pueden modificar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Miembro desde
                  </span>
                  <span className="font-medium">
                    {new Date(user.fechaRegistro).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Roles</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {user.roles.map((rol) => (
                      <Badge key={rol.id} variant="secondary">
                        {rol.nombreRol}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fila 2 (ocupa todo el ancho): Formulario de Contraseña */}
        <div className="lg:col-span-3">
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
};
