// src/services/types/simple/LibroDto.ts
// Basado en LibroDto.java

export interface LibroDto {
  isbn: string;
  titulo: string;
  autor: string;
  fechaPublicacion: string; // Instant se recibe como string
  categoriaNombre: string;
  editorialNombre: string;
}
