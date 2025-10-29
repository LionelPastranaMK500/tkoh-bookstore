// src/pages/UnauthorizedPage.tsx
import { Link } from 'react-router-dom';

export const UnauthorizedPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Acceso Denegado</h1>
      <p>No tienes permiso para ver esta página.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};
