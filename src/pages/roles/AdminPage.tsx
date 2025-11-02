// --- src/pages/roles/AdminPage.tsx ---
import { UserTable } from '@/modules/admin/components/UserTable'; // Ajusta la ruta si es necesario

// Placeholder simple para la página principal del rol Admin
export const AdminPage = () => {
  return (
    <div className="container mx-auto py-8">
      {' '}
      {/* Usa container y padding */}
      {/* <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1> */}
      {/* Renderiza la tabla de usuarios */}
      <UserTable />
    </div>
  );
};
