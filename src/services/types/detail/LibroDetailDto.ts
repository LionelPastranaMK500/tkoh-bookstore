// src/services/types/detail/LibroDetailDto.ts
// Basado en LibroDetailDto.java
import type { CategoriaDto } from '../simple/CategoriaDto';
import type { EditorialDto } from '../simple/EditorialDto';

export interface LibroDetailDto {
  isbn: string;
  titulo: string;
  autor: string;
  fechaPublicacion: string;
  categoria: CategoriaDto;
  editorial: EditorialDto;
}
