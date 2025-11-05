// src/modules/editorial/components/EditorialTable.tsx
import { useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAuthStore } from '@/services/auth/authStore'; // <-- 1. Importar AuthStore

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
import { useEditoriales } from '@/services/editorial/editorialApi';
import type { EditorialDto } from '@/services/types/simple/EditorialDto';

// Modales
import { CreateEditorialDialog } from './CreateEditorialDialog';
import { EditEditorialDialog } from './EditEditorialDialog';
import { DeleteEditorialDialog } from './DeleteEditorialDialog';

// Estado para los modales
type ModalState = {
  create: boolean;
  edit: EditorialDto | null;
  delete: EditorialDto | null;
};

// --- FUNCIÓN HELPER "hasPermission" ELIMINADA ---

export function EditorialTable() {
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [modal, setModal] = useState<ModalState>({
    create: false,
    edit: null,
    delete: null,
  });

  // --- Obtener usuario y sus permisos ---
  const user = useAuthStore((state) => state.user);
  const userRoles = user?.roles || [];

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
  const canManage = canCreate || canUpdate || canDelete;

  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useEditoriales({
    page: pagination.page,
    size: pagination.size,
  });

  const editoriales: EditorialDto[] = apiResponse?.data?.content ?? [];
  const pageInfo = apiResponse?.data;

  const columns: ColumnDef<EditorialDto>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="pl-4">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
    },
    // --- Columna de Acciones Condicional ---
    ...(canManage
      ? [
          {
            id: 'actions',
            header: () => <div className="text-right pr-4">Acciones</div>,
            cell: ({ row }: { row: any }) => {
              const editorial = row.original;
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
                      {canUpdate && (
                        <DropdownMenuItem
                          onClick={() =>
                            setModal((prev) => ({ ...prev, edit: editorial }))
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              setModal((prev) => ({
                                ...prev,
                                delete: editorial,
                              }))
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
          } as ColumnDef<EditorialDto>,
        ]
      : []),
  ];

  // Hook de la Tabla
  const table = useReactTable({
    data: editoriales,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pageInfo?.totalPages ?? -1,
  });

  if (isLoading) {
    return <div className="text-center p-8">Cargando editoriales...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        Error al cargar editoriales: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl font-bold">Editoriales</h2>
        </div>
        {/* --- Botón de Crear Condicional --- */}
        {canCreate && (
          <Button
            onClick={() => setModal((prev) => ({ ...prev, create: true }))}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Editorial
          </Button>
        )}
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
                  No se encontraron editoriales.
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
      {canCreate && (
        <CreateEditorialDialog
          open={modal.create}
          onOpenChange={(open) =>
            setModal((prev) => ({ ...prev, create: open }))
          }
          onEditorialCreated={() => refetch()}
        />
      )}

      {canUpdate && (
        <EditEditorialDialog
          open={!!modal.edit}
          onOpenChange={() => setModal((prev) => ({ ...prev, edit: null }))}
          editorial={modal.edit}
          onEditorialUpdated={() => refetch()}
        />
      )}

      {canDelete && (
        <DeleteEditorialDialog
          open={!!modal.delete}
          onOpenChange={() => setModal((prev) => ({ ...prev, delete: null }))}
          editorial={modal.delete}
          onEditorialDeleted={() => refetch()}
        />
      )}
    </div>
  );
}
