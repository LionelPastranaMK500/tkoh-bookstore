export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  // Añade cualquier otro campo que tu backend vaya a devolver
  // por ejemplo, roles: string[];
}
