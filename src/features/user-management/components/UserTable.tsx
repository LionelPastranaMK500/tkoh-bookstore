// src/features/user-management/components/UserTable.tsx
import { useState } from 'react';
// Corregido: Importar tipos con 'import type'
import type {
  ColumnDef,
  SortingState, // Tipo para estado de ordenación
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel, // Para paginación
  getSortedRowModel, // Para ordenar
  useReactTable,
} from '@tanstack/react-table';
// Corregido: Rutas de importación para shadcn/ui (apuntando a src/components/ui)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { ArrowUpDown, MoreHorizontal, UserPlus } from 'lucide-react'; // Iconos

// Importar el hook y los tipos necesarios (rutas sin cambios aquí)
import { useUsers } from '@/features/user-management/hooks/useUsers';
import type { User } from '@/features/auth/interface/User';
import type { RoleDto } from '@/features/auth/interface/RoleDto';

// --- Componente CreateUserDialog (Placeholder) ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CreateUserDialog = ({
  onUserCreated: _onUserCreated,
}: {
  onUserCreated: () => void;
}) => {
  // TODO: Implementar modal real con npx shadcn@latest add dialog
  return (
    <Button onClick={() => alert('Abrir modal para crear usuario')}>
      <UserPlus className="mr-2 h-4 w-4" /> Crear Usuario
    </Button>
  );
};

// Función auxiliar para mostrar los nombres de los roles de forma legible
const formatRoles = (roles: RoleDto[] | undefined | null): string => {
  if (!roles || roles.length === 0) {
    return 'N/A';
  }
  return roles.map((role) => role.nombreRol).join(', ');
};

// --- Definición de Columnas para la tabla (sin cambios lógicos) ---
export const columns: ColumnDef<User>[] = [
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nombre Usuario <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('nombreUsuario')}</div>,
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
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => (
      <div className="capitalize">{formatRoles(row.original.roles)}</div>
    ),
  },
  {
    accessorKey: 'enabled',
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue('enabled') ? (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs dark:bg-green-900 dark:text-green-200">
            Activo
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs dark:bg-red-900 dark:text-red-200">
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
      // TODO: Implementar DropdownMenu de shadcn/ui con acciones reales (Editar, Eliminar)
      // npx shadcn@latest add dropdown-menu
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

// --- Componente Principal de la Tabla (sin cambios lógicos) ---
export function UserTable() {
  const { data: apiResponse, isLoading, error, refetch } = useUsers();
  const [sorting, setSorting] = useState<SortingState>([]);

  const users = apiResponse?.data?.content ?? [];
  const pageInfo = apiResponse?.data;

  console.log('API Response:', apiResponse); // Log para depuración
  console.log('Users Data:', users); // Log para depuración
  console.log('Page Info:', pageInfo); // Log para depuración

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
    // TODO: Implementar onPaginationChange para llamar a la API con nueva página/tamaño
    // onPaginationChange: (updater) => { ... }
  });

  if (isLoading) {
    // TODO: Usar Skeleton component de shadcn/ui
    return <div className="text-center p-8">Cargando usuarios...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        Error al cargar usuarios: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <div></div>
        <CreateUserDialog onUserCreated={refetch} />
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow">
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
                  No se encontraron usuarios o la API no devolvió datos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount() === -1 ? '?' : table.getPageCount()}. Total:{' '}
          {pageInfo?.totalElements ?? users.length} usuarios.
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
    </div>
  );
}
