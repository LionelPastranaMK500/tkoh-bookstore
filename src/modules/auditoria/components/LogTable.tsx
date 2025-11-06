// src/modules/auditoria/components/LogTable.tsx
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Iconos
import { MoreHorizontal, Eye, Loader2 } from 'lucide-react';

// Componentes UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useLogs } from '@/services/auditoria/logApi';
import type { LogActividadDto } from '@/services/types/simple/LogActividadDto';
import type { FetchLogsParams } from '@/services/types/auditoria/FetchLogsParams';

// Modales
import { LogDetailsDialog } from './LogDetailsDialog';

type ModalState = {
  view: number | null; // Solo guardamos el ID
};

export function LogTable() {
  const [modal, setModal] = useState<ModalState>({ view: null });

  // Estado para paginación y filtros
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [filters, setFilters] = useState<Partial<FetchLogsParams>>({
    nombreUsuario: '',
    accion: '',
  });

  const queryParams = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ...filters,
  };

  const { data: apiResponse, isLoading, error } = useLogs(queryParams);

  const logs: LogActividadDto[] = apiResponse?.data?.content ?? [];
  const pageInfo = apiResponse?.data;

  // Definición de Columnas
  const columns: ColumnDef<LogActividadDto>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="pl-4">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      cell: ({ row }) => (
        <div className="font-medium">
          {new Date(row.getValue('fecha')).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'usuarioNombre',
      header: 'Usuario',
    },
    {
      accessorKey: 'accionRealizada',
      header: 'Acción',
    },
    {
      accessorKey: 'detalles',
      header: 'Detalles',
      cell: ({ row }) => (
        <div className="truncate max-w-xs">{row.getValue('detalles')}</div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right pr-4">Acciones</div>,
      cell: ({ row }) => {
        const log = row.original;
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
                <DropdownMenuItem onClick={() => setModal({ view: log.id })}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
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
    data: logs,
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl font-bold">Auditoría (Logs de Actividad)</h2>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filtrar por nombre de usuario..."
          name="nombreUsuario"
          value={filters.nombreUsuario}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
        <Input
          placeholder="Filtrar por acción..."
          name="accion"
          value={filters.accion}
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
                  Error al cargar logs: {error.message}
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
                  No se encontraron logs con los filtros actuales.
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

      {/* --- MODAL --- */}
      <LogDetailsDialog
        open={!!modal.view}
        onOpenChange={() => setModal({ view: null })}
        logId={modal.view}
      />
    </div>
  );
}
