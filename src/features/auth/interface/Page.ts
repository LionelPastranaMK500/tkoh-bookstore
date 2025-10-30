export interface Page<T> {
  content: T[]; // El array de elementos de la página actual
  totalElements: number; // Número total de elementos en todas las páginas
  totalPages: number; // Número total de páginas
  size: number; // Tamaño de la página solicitado
  number: number; // Número de la página actual (basado en 0)
  first: boolean; // ¿Es la primera página?
  last: boolean; // ¿Es la última página?
  numberOfElements: number; // Número de elementos en la página actual
  empty: boolean; // ¿La página está vacía?
  // Puedes añadir otras propiedades si tu backend las incluye (sort, pageable, etc.)
}
