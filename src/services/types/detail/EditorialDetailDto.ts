// src/services/types/detail/EditorialDetailDto.ts
import type { LibroDto } from '../simple/LibroDto';

export interface EditorialDetailDto {
  id: number;
  nombre: string;
  libros: LibroDto[];
}
