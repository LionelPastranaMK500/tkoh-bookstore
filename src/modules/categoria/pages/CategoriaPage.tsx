// src/modules/categoria/pages/CategoriaPage.tsx
import { CategoriaTable } from '@/modules/categoria/components/CategoriaTable';

export const CategoriaPage = () => {
  return (
    <div className="container mx-auto py-8">
      {/* <h1 className="text-3xl font-bold mb-6">Gestión de Categorías</h1> */}
      <CategoriaTable />
    </div>
  );
};
