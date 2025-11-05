// src/modules/categoria/components/CategoriaTable.tsx
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Iconos
import { MoreHorizontal, PlusCircle, Edit, Trash } from 'lucide-react';

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

// Hooks de API y Tipos
import {
  useCategorias,
  // useDeleteCategoria, // Ya lo manejamos en el modal
} from '@/services/categoria/categoriaApi';
import type { CategoriaDto } from '@/services/types/simple/CategoriaDto';

// Modales
import { CreateCategoriaDialog } from './CreateCategoriaDialog';
import { EditCategoriaDialog } from './EditCategoriaDialog';
import { DeleteCategoriaDialog } from './DeleteCategoriaDialog';

// Estado para los modales
type ModalState = {
  create: boolean;
  edit: CategoriaDto | null;
  delete: CategoriaDto | null;
};

export function CategoriaTable() {
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [modal, setModal] = useState<ModalState>({
    create: false,
    edit: null,
    delete: null,
  });

  // Hook de React Query para obtener datos
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useCategorias({
    page: pagination.page,
    size: pagination.size,
  });

  const categorias: CategoriaDto[] = apiResponse?.data?.content ?? [];
  const pageInfo = apiResponse?.data;

  // Definición de Columnas
  const columns: ColumnDef<CategoriaDto>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="pl-4">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
    },
    {
      id: 'actions',
      header: () => <div className="text-right pr-4">Acciones</div>,
      cell: ({ row }) => {
        const categoria = row.original;
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
                <DropdownMenuItem
                  onClick={() =>
                    setModal((prev) => ({ ...prev, edit: categoria }))
                  }
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() =>
                    setModal((prev) => ({ ...prev, delete: categoria }))
                  }
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Hook de la Tabla
  const table = useReactTable({
    data: categorias,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pageInfo?.totalPages ?? -1,
  });

  if (isLoading) {
    return <div className="text-center p-8">Cargando categorías...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        Error al cargar categorías: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <div>{/* Espacio para filtros */}</div>
        <Button onClick={() => setModal((prev) => ({ ...prev, create: true }))}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Categoría
        </Button>
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
                  No se encontraron categorías.
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
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            disabled={pageInfo?.first}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            disabled={pageInfo?.last}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* --- MODALES --- */}
      <CreateCategoriaDialog
        open={modal.create}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, create: open }))}
        onCategoriaCreated={() => refetch()}
      />

      <EditCategoriaDialog
        open={!!modal.edit}
        onOpenChange={() => setModal((prev) => ({ ...prev, edit: null }))}
        categoria={modal.edit}
        onCategoriaUpdated={() => refetch()}
      />

      <DeleteCategoriaDialog
        open={!!modal.delete}
        onOpenChange={() => setModal((prev) => ({ ...prev, delete: null }))}
        categoria={modal.delete}
        onCategoriaDeleted={() => refetch()}
      />
    </div>
  );
}
