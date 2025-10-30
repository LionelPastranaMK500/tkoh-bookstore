import type { User } from '@/features/auth/interface/User';

// Define la jerarquía de roles (el más alto primero)
// Asegúrate que estos nombres coincidan EXACTAMENTE con los `nombreRol` de tu API/DB
const roleHierarchy = ['OWNER', 'ADMIN', 'VENDEDOR', 'USUARIO'];

/**
 * Determina el rol más alto de un usuario basado en la jerarquía definida.
 * @param user El objeto User. Puede ser null si el usuario no está cargado.
 * @returns El nombre del rol más alto (string) o null si el usuario no tiene roles o no es válido.
 */
export const getHighestRole = (user: User | null): string | null => {
  // Verifica si el usuario existe y tiene un array de roles con al menos un rol.
  if (!user?.roles || user.roles.length === 0) {
    return null;
  }

  // Itera sobre la jerarquía definida.
  for (const roleName of roleHierarchy) {
    // Busca si el usuario tiene un rol que coincida con el nombre actual en la jerarquía.
    if (user.roles.some((userRole) => userRole.nombreRol === roleName)) {
      // Si encuentra una coincidencia, devuelve ese nombre de rol (el más alto encontrado hasta ahora).
      return roleName;
    }
  }

  // Si después de revisar toda la jerarquía, no se encontró ningún rol conocido,
  // devuelve el nombre del primer rol que tenga el usuario como fallback.
  // Si por alguna razón el array `roles` estuviera vacío (aunque la primera verificación debería evitarlo), devuelve null.
  return user.roles[0]?.nombreRol || null;
};

/**
 * Devuelve la ruta principal (path) correspondiente al rol más alto del usuario.
 * @param user El objeto User. Puede ser null.
 * @returns La ruta a la que redirigir (string). Por defecto, '/'.
 */
export const getRedirectPathForUser = (user: User | null): string => {
  // Obtiene el rol más alto del usuario usando la función anterior.
  const highestRole = getHighestRole(user);

  // Determina la ruta de redirección basada en el rol más alto.
  switch (highestRole) {
    case 'OWNER':
      return '/owner'; // Ruta para el panel del Owner.
    case 'ADMIN':
      return '/admin'; // Ruta para el panel de Administración.
    case 'VENDEDOR':
      return '/vendedor'; // Ruta para el panel del Vendedor.
    case 'USUARIO':
      // Para el rol USUARIO, podrías redirigir a una página específica '/usuario'
      // o a la página principal '/'. Decide cuál es la experiencia deseada.
      // return '/usuario'; // Si tienes una página específica para usuarios logueados.
      return '/'; // Si la página principal es adecuada para usuarios logueados.
    default:
      // Si el usuario no tiene rol o el rol no es reconocido, redirige a la página principal.
      // También podría redirigir a '/login' si se considera un estado inválido.
      return '/';
  }
};
