// src/modules/tarea/components/TareaTable.tsx
import { useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAuthStore } from '@/services/auth/authStore';

// Iconos
import { MoreHorizontal, PlusCircle, Edit, Trash, Loader2 } from 'lucide-react';

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
import { Badge } from '@/shared/ui/badge';

// Hooks de API y Tipos
import { useTareas } from '@/services/tarea/tareaApi';
import type { TareaDto } from '@/services/types/simple/TareaDto';
import type { FetchTareasParams } from '@/services/types/tarea/FetchTareasParams';

// Modales
import { CreateTareaDialog } from './CreateTareaDialog';
import { EditTareaDialog } from './EditTareaDialog';
import { DeleteTareaDialog } from './DeleteTareaDialog';

type ModalState = {
  create: boolean;
  edit: TareaDto | null;
  delete: TareaDto | null;
};

interface TareaTableProps {
  scope: 'all' | 'me';
}

export function TareaTable({ scope }: TareaTableProps) {
  const [modal, setModal] = useState<ModalState>({
    create: false,
    edit: null,
    delete: null,
  });

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [completadoFilter, setCompletadoFilter] = useState<boolean | undefined>(
    false, // Por defecto, mostrar solo "pendientes" en 'me'
  );

  // --- Lógica de Negocio (Permisos) ---
  const user = useAuthStore((state) => state.user);
  const userRoles = user?.roles || [];

  // Basado en los permisos de TareaController
  const canCreate = useMemo(
    () =>
      userRoles.some((r) => r.nombreRol === 'OWNER' || r.nombreRol === 'ADMIN'),
    [userRoles],
  );
  const canUpdate = useMemo(
    () =>
      userRoles.some((r) => r.nombreRol === 'OWNER' || r.nombreRol === 'ADMIN'),
    [userRoles],
  );
  const canDelete = useMemo(
    () =>
      userRoles.some((r) => r.nombreRol === 'OWNER' || r.nombreRol === 'ADMIN'),
    [userRoles],
  );

  const queryParams: FetchTareasParams = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    scope: scope,
    completado: scope === 'me' ? completadoFilter : undefined,
  };

  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useTareas(queryParams);

  const tareas: TareaDto[] = apiResponse?.data?.content ?? [];
  const pageInfo = apiResponse?.data;

  // Definición de Columnas
  const columns: ColumnDef<TareaDto>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: ({ row }) => (
        <div className="font-medium max-w-sm truncate">
          {row.getValue('descripcion')}
        </div>
      ),
    },
    {
      accessorKey: 'usuarioAsignadoNombre',
      header: 'Asignado a',
    },
    {
      accessorKey: 'completado',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.getValue('completado') ? 'default' : 'secondary'}>
          {row.getValue('completado') ? 'Completado' : 'Pendiente'}
        </Badge>
      ),
    },
    {
      accessorKey: 'fechaLimite',
      header: 'Fecha Límite',
      cell: ({ row }) => {
        const fecha = row.getValue('fechaLimite') as string;
        return fecha ? new Date(fecha).toLocaleDateString() : 'N/A';
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right pr-4">Acciones</div>,
      cell: ({ row }) => {
        const tarea = row.original;
        // Lógica de permisos para editar
        // Un Vendedor puede editar "sus" tareas (para marcarlas como completas)
        // Un Admin/Owner puede editar "cualquier" tarea
        const canEditThis = canUpdate || scope === 'me';

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
                {canEditThis && (
                  <DropdownMenuItem
                    onClick={() =>
                      setModal((prev) => ({ ...prev, edit: tarea }))
                    }
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar / Ver
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        setModal((prev) => ({ ...prev, delete: tarea }))
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
    data: tareas,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl font-bold">
            {scope === 'all' ? 'Gestión de Tareas' : 'Mis Tareas'}
          </h2>
        </div>
        {canCreate && (
          <Button
            onClick={() => setModal((prev) => ({ ...prev, create: true }))}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Asignar Tarea
          </Button>
        )}
      </div>

      {/* Filtros */}
      {scope === 'me' && (
        <div className="flex items-center gap-2">
          <Button
            variant={completadoFilter === false ? 'default' : 'outline'}
            onClick={() => setCompletadoFilter(false)}
          >
            Pendientes
          </Button>
          <Button
            variant={completadoFilter === true ? 'default' : 'outline'}
            onClick={() => setCompletadoFilter(true)}
          >
            Completadas
          </Button>
          <Button
            variant={completadoFilter === undefined ? 'default' : 'outline'}
            onClick={() => setCompletadoFilter(undefined)}
          >
            Todas
          </Button>
        </div>
      )}

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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="h-6 w-6 animate-spin inline-block" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-destructive"
                >
                  Error al cargar tareas: {error.message}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                  No se encontraron tareas.
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
      {canCreate && (
        <CreateTareaDialog
          open={modal.create}
          onOpenChange={(open) =>
            setModal((prev) => ({ ...prev, create: open }))
          }
          onTareaCreated={() => refetch()}
        />
      )}

      <EditTareaDialog
        open={!!modal.edit}
        onOpenChange={() => setModal((prev) => ({ ...prev, edit: null }))}
        tarea={modal.edit}
        onTareaUpdated={() => refetch()}
      />

      {canDelete && (
        <DeleteTareaDialog
          open={!!modal.delete}
          onOpenChange={() => setModal((prev) => ({ ...prev, delete: null }))}
          tarea={modal.delete}
          onTareaDeleted={() => refetch()}
        />
      )}
    </div>
  );
}
