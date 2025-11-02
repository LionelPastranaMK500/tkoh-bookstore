// (Este es el antiguo pages/NotFoundPage.tsx, movido a 'modules')

export const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">
          404
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
          Página No Encontrada
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  );
};
