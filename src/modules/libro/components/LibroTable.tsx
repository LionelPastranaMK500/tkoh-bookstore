// src/modules/libro/components/LibroTable.tsx
import { useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAuthStore } from '@/services/auth/authStore';

// Iconos
import { MoreHorizontal, PlusCircle, Edit, Trash, Eye } from 'lucide-react';

// Componentes UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

// Hooks de API y Tipos
import { useLibros } from '@/services/libro/libroApi';
import type { LibroDto } from '@/services/types/simple/LibroDto';

// Modales
import { CreateLibroDialog } from './CreateLibroDialog';
import { EditLibroDialog } from './EditLibroDialog';
import { DeleteLibroDialog } from './DeleteLibroDialog';
// 1. Importa el nuevo diálogo de detalles
import { LibroDetailsDialog } from './LibroDetailsDialog';

type ModalState = {
  create: boolean;
  edit: LibroDto | null;
  delete: LibroDto | null;
  view: string | null; // 2. Añade 'view' para guardar el ISBN
};

export function LibroTable() {
  // 3. Actualiza el estado inicial del modal
  const [modal, setModal] = useState<ModalState>({
    create: false,
    edit: null,
    delete: null,
    view: null, // Inicializa 'view'
  });

  // Estado para la paginación y filtros
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filtros, setFiltros] = useState({ titulo: '', autor: '' });

  // --- Lógica de Negocio (Permisos) ---
  const user = useAuthStore((state) => state.user);
  const userRoles = user?.roles || [];

  const canManage = useMemo(
    () =>
      userRoles.some((r) => r.nombreRol === 'OWNER' || r.nombreRol === 'ADMIN'),
    [userRoles],
  );

  // Hook de React Query para obtener datos
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useLibros({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ...filtros,
  });

  const libros: LibroDto[] = apiResponse?.data?.content ?? [];
  const pageInfo = apiResponse?.data;

  // Definición de Columnas
  const columns: ColumnDef<LibroDto>[] = [
    {
      accessorKey: 'isbn',
      header: 'ISBN',
      cell: ({ row }) => (
        <div className="pl-4 font-mono text-xs">{row.getValue('isbn')}</div>
      ),
    },
    {
      accessorKey: 'titulo',
      header: 'Título',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('titulo')}</div>
      ),
    },
    {
      accessorKey: 'autor',
      header: 'Autor',
    },
    {
      accessorKey: 'categoriaNombre',
      header: 'Categoría',
    },
    {
      accessorKey: 'editorialNombre',
      header: 'Editorial',
    },
    {
      id: 'actions',
      header: () => <div className="text-right pr-4">Acciones</div>,
      cell: ({ row }) => {
        const libro = row.original;
        return (
          <div className="text-right pr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                {/* 4. Implementa el onClick del botón de detalles */}
                <DropdownMenuItem
                  onClick={() =>
                    setModal((prev) => ({ ...prev, view: libro.isbn }))
                  }
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
                </DropdownMenuItem>

                {/* --- Acciones Condicionales --- */}
                {canManage && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        setModal((prev) => ({ ...prev, edit: libro }))
                      }
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        setModal((prev) => ({ ...prev, delete: libro }))
                      }
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Hook de la Tabla
  const table = useReactTable({
    data: libros,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pageInfo?.totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        setPagination(updater(pagination));
      } else {
        setPagination(updater);
      }
    },
  });

  // --- Manejadores de Filtros ---
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
    // Resetear paginación al filtrar
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  if (isLoading) {
    return <div className="text-center p-8">Cargando libros...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        Error al cargar libros: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl font-bold">Catálogo de Libros</h2>
        </div>
        {/* --- Botón de Crear Condicional --- */}
        {canManage && (
          <Button
            onClick={() => setModal((prev) => ({ ...prev, create: true }))}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Libro
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filtrar por título..."
          name="titulo"
          value={filtros.titulo}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
        <Input
          placeholder="Filtrar por autor..."
          name="autor"
          value={filtros.autor}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron libros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between space-x-2 pt-4">
        <div className="text-sm text-muted-foreground">
          Página {pageInfo ? pageInfo.number + 1 : 0} de{' '}
          {pageInfo?.totalPages ?? 0}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* --- MODALES --- */}

      {/* 5. Renderiza el nuevo modal de detalles */}
      <LibroDetailsDialog
        open={!!modal.view}
        onOpenChange={(open) =>
          setModal((prev) => ({ ...prev, view: open ? prev.view : null }))
        }
        isbn={modal.view}
      />

      {/* --- MODALES CONDICIONALES --- */}
      {canManage && (
        <>
          <CreateLibroDialog
            open={modal.create}
            onOpenChange={(open) =>
              setModal((prev) => ({ ...prev, create: open }))
            }
            onLibroCreated={() => refetch()}
          />
          <EditLibroDialog
            open={!!modal.edit}
            onOpenChange={() => setModal((prev) => ({ ...prev, edit: null }))}
            libro={modal.edit}
            onLibroUpdated={() => refetch()}
          />
          <DeleteLibroDialog
            open={!!modal.delete}
            onOpenChange={() => setModal((prev) => ({ ...prev, delete: null }))}
            libro={modal.delete}
            onLibroDeleted={() => refetch()}
          />
        </>
      )}
    </div>
  );
}
