// src/services/types/detail/CategoriaDetailDto.ts
import type { LibroDto } from '@/services/types/simple/LibroDto';
export interface CategoriaDetailDto {
  id: number;
  nombre: string;
  libros: LibroDto[];
}
