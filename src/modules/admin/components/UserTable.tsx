import { useState } from 'react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { ArrowUpDown, MoreHorizontal, UserPlus } from 'lucide-react';

import { useUsers } from '@/services/admin/userApi';
import type { UsuarioDto } from '@/services/types/simple/UsuarioDto';
import { CreateUserDialog } from './CreateUserDialog';

export const columns: ColumnDef<UsuarioDto>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase pl-4">{row.getValue('id')}</div>
    ),
  },
  {
    accessorKey: 'nombreUsuario',
    header: 'Nombre Usuario',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'fechaRegistro',
    header: 'Registrado',
    cell: ({ row }) => {
      const date = new Date(row.getValue('fechaRegistro'));
      return <div className="font-medium">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'enabled',
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue('enabled') ? (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs dark:bg-green-800/20 dark:text-green-300">
            Activo
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs dark:bg-red-800/20 dark:text-red-300">
            Inactivo
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="text-right pr-4">Acciones</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-right pr-4">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => alert(`Acciones para usuario ID: ${user.id}`)}
          >
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// --- Componente Principal de la Tabla ---
export function UserTable() {
  const { data: apiResponse, isLoading, error, refetch } = useUsers();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const users: UsuarioDto[] = apiResponse?.data?.content ?? [];
  const pageInfo = apiResponse?.data;

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    manualPagination: true,
    pageCount: pageInfo?.totalPages ?? -1,
  });

  if (isLoading) {
    return <div className="text-center p-8">Cargando usuarios...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        Error al cargar usuarios: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <div>{/* Espacio para filtros */}</div>

        {/* --- 4. BOTÓN REAL QUE ABRE EL MODAL --- */}
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Crear Usuario
        </Button>
      </div>

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
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación (sin cambios) */}
      <div className="flex items-center justify-between space-x-2 pt-4">
        {/* ... (código de paginación) ... */}
      </div>

      {/* --- 5. RENDERIZAR EL DIÁLOGO (oculto por defecto) --- */}
      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onUserCreated={() => refetch()} // Llama a 'refetch' de useUsers
      />
    </div>
  );
}
