// src/modules/dashboard/pages/DashboardPage.tsx
import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Principal</h1>
      <p className="text-muted-foreground">
        Bienvenido al panel de TKOH Bookstore.
      </p>
    </div>
  );
};
