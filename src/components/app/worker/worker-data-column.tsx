import { Cell, ColumnDef } from '@tanstack/react-table'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Pen, Trash } from 'lucide-react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import { Worker } from '@/models/entities/worker'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useWorkerQuery } from '@/hooks/use-worker'
import { useCallback } from 'react'
import WorkerForm, { WorkerFormDataValues } from './worker-form'
import { toast } from 'sonner'
import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { Checkbox } from '@/components/ui/checkbox'
import {
  TableBooleanCell,
  TableDateTimeCell,
} from '@/components/share/table/table-cell'

const WorkerActions = ({ cell }: { cell: Cell<Worker, unknown> }) => {
  const { closeAll } = useOverlay()
  const { updated, list, deleted } = useWorkerQuery()

  const onEdit = useCallback(
    async (data: WorkerFormDataValues) => {
      await updated.mutateAsync(
        {
          id: cell.row.original.id,
          data: {
            name: data.name!,
            isActive: data.isActive!,
            position: data.position!,
            hiredAt: data.hiredAt ? new Date(data.hiredAt) : null,
          },
        },
        {
          onSettled(_data, error) {
            if (error) {
              toast.error(error.message)
            } else {
              toast.success('Worker updated successfully.')
              list.refetch()
              closeAll()
            }
          },
        },
      )
    },
    [cell.row.original.id, closeAll, list, updated],
  )

  const onDelete = useCallback(async () => {
    await deleted.mutateAsync(
      {
        id: cell.row.original.id,
      },
      {
        onSettled(error) {
          if (error) {
            toast.error(error)
          } else {
            toast.success('Worker deleted successfully.')
            list.refetch()
            closeAll()
          }
        },
      },
    )
  }, [cell.row.original.id, closeAll, deleted, list])

  return (
    <ActionDropdown id={cell.row.original.id}>
      <ModalDialog
        title={'Edit Worker'}
        description="Modify the worker information as needed."
        closeOutside={false}
        trigger={
          <DropdownMenuItem>
            <Pen /> Edit
          </DropdownMenuItem>
        }
      >
        <WorkerForm values={cell.row.original} onSubmit={onEdit} />
      </ModalDialog>
      <ConfirmDialog
        title={'Delete Worker!'}
        description="Are you sure you want to delete this worker? This action cannot be undone."
        trigger={
          <DropdownMenuItem variant={'destructive'}>
            <Trash /> Delete
          </DropdownMenuItem>
        }
        onConfirm={onDelete}
      />
    </ActionDropdown>
  )
}

export const selectWorkerColumn: ColumnDef<Worker>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
]

export const workerColumns: ColumnDef<Worker>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'isActive',
    header: 'Is Active',
    cell: TableBooleanCell,
  },
  {
    accessorKey: 'hiredAt',
    header: 'Hired At',
    cell: TableDateTimeCell,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: WorkerActions,
  },
]
