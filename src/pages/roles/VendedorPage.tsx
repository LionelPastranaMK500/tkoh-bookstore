// --- src/pages/roles/VendedorPage.tsx ---
export const VendedorPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Panel del Vendedor</h1>
      <p className="text-gray-600">
        Bienvenido, Vendedor. Aquí puedes consultar el catálogo y comunicarte
        con clientes.
      </p>
      {/* TODO: Añadir componentes para Vendedores (ej: Buscador de Libros, Lista de Chats) */}
    </div>
  );
};
