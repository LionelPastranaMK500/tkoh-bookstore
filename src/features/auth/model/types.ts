// Este es un tipo de placeholder.
// Puedes (y deberías) expandirlo después para que coincida
// con tu entidad 'User' del backend de Spring Boot.
export interface User {
  id: number;
  username: string;
  email: string;
  roles?: string[];
}
