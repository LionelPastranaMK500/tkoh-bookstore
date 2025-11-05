import { useState } from 'react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from 'react-toastify';

import {
  ArrowUpDown,
  MoreHorizontal,
  UserPlus,
  Eye,
  Edit,
  Trash,
  KeyRound,
  UsersRound,
} from 'lucide-react';

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

import { useUsers, useDeleteUser } from '@/services/admin/userApi';
import type { UsuarioDto } from '@/services/types/simple/UsuarioDto';

import { CreateUserDialog } from './CreateUserDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { EditUserDialog } from './EditUserDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { AssignRolesDialog } from './AssignRolesDialog';
// Estado para controlar qué modal está abierto
type ModalState = {
  view: UsuarioDto | null;
  edit: UsuarioDto | null;
  delete: UsuarioDto | null;
  password: UsuarioDto | null;
  assignRoles: UsuarioDto | null;
};

// --- Componente Principal de la Tabla ---
export function UserTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Estado para los modales de acciones
  const [modal, setModal] = useState<ModalState>({
    view: null,
    edit: null,
    delete: null,
    password: null,
    assignRoles: null, // <-- INICIALIZAR ESTADO
  });

  // Hooks de React Query
  const { data: apiResponse, isLoading, error, refetch } = useUsers();
  const { mutate: deleteUserMutate, isPending: isDeleting } = useDeleteUser();

  // Extraer datos
  const users: UsuarioDto[] = apiResponse?.data?.content ?? [];
  const pageInfo = apiResponse?.data;

  // --- Lógica de Acciones ---

  const handleDeleteUser = () => {
    if (!modal.delete) return;

    deleteUserMutate(modal.delete.id, {
      onSuccess: () => {
        toast.success(
          `Usuario "${modal.delete?.nombreUsuario}" eliminado con éxito.`,
        );
        // Resetea TODOS los modales al cerrar
        setModal({
          view: null,
          edit: null,
          delete: null,
          password: null,
          assignRoles: null,
        }); // <-- RESETEAR AQUÍ
        refetch(); // Refresca la tabla
      },
      onError: (err: any) => {
        const apiError =
          err.response?.data?.message || 'No se pudo eliminar el usuario.';
        toast.error(apiError);
        setModal({
          view: null,
          edit: null,
          delete: null,
          password: null,
          assignRoles: null,
        }); // <-- RESETEAR AQUÍ
      },
    });
  };

  // --- Definición de Columnas ---
  // (Definidas dentro del componente para acceder a `setModal` y `isDeleting`)
  const columns: ColumnDef<UsuarioDto>[] = [
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
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  disabled={isDeleting} // Deshabilitar si se está borrando algo
                >
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setModal((prev) => ({ ...prev, view: user }))}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setModal((prev) => ({ ...prev, edit: user }))}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Usuario
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setModal((prev) => ({ ...prev, password: user }))
                  }
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Cambiar Contraseña
                </DropdownMenuItem>

                {/* --- NUEVO ITEM DE MENÚ --- */}
                <DropdownMenuItem
                  onClick={() =>
                    setModal((prev) => ({ ...prev, assignRoles: user }))
                  }
                >
                  <UsersRound className="mr-2 h-4 w-4" />
                  Asignar Roles
                </DropdownMenuItem>
                {/* --- FIN DEL NUEVO ITEM --- */}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() =>
                    setModal((prev) => ({ ...prev, delete: user }))
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

  // --- Hook de la Tabla ---
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

  // --- Renderizado ---

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
            onClick={() => console.log('Ir a página anterior')} // Reemplazar con lógica de paginación
            disabled={pageInfo?.first}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Ir a página siguiente')} // Reemplazar con lógica de paginación
            disabled={pageInfo?.last}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* --- MODALES --- */}

      {/* Diálogo de CREAR */}
      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onUserCreated={() => refetch()}
      />

      {/* Diálogo de VER DETALLES */}
      <UserDetailsDialog
        open={!!modal.view}
        onOpenChange={() => setModal((prev) => ({ ...prev, view: null }))}
        userId={modal.view?.id ?? null}
      />

      {/* Diálogo de EDITAR */}
      <EditUserDialog
        open={!!modal.edit}
        onOpenChange={() => setModal((prev) => ({ ...prev, edit: null }))}
        user={modal.edit}
        onUserUpdated={() => refetch()}
      />

      {/* Diálogo de ELIMINAR */}
      <ConfirmDeleteDialog
        open={!!modal.delete}
        onOpenChange={() => setModal((prev) => ({ ...prev, delete: null }))}
        user={modal.delete}
        isDeleting={isDeleting}
        onConfirm={handleDeleteUser}
      />

      {/* Diálogo de CAMBIAR CONTRASEÑA */}
      <ChangePasswordDialog
        open={!!modal.password}
        onOpenChange={() => setModal((prev) => ({ ...prev, password: null }))}
        user={modal.password}
      />

      {/* --- RENDERIZAR EL NUEVO DIÁLOGO --- */}
      <AssignRolesDialog
        open={!!modal.assignRoles}
        onOpenChange={() =>
          setModal((prev) => ({ ...prev, assignRoles: null }))
        }
        user={modal.assignRoles}
        onRolesUpdated={() => refetch()}
      />
    </div>
  );
}
