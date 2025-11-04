// src/modules/profile/pages/ProfilePage.tsx
import React from 'react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <p className="text-muted-foreground">
        Aquí podrás ver y actualizar tu información personal.
      </p>
    </div>
  );
};
