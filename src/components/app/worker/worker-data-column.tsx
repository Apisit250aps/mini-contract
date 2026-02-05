import { Cell, ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Button } from '@/components/ui/button'
import { IconDotsVertical } from '@tabler/icons-react'
import { Pen, Trash } from 'lucide-react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import { Worker } from '@/models/entities/worker'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useWorkerQuery } from '@/hooks/use-worker'
import { useCallback } from 'react'
import WorkerForm, { WorkerFormDataValues } from './worker-form'
import { toast } from 'sonner'

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
  },
  {
    accessorKey: 'hiredAt',
    header: 'Hired At',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: WorkerActions,
  },
]
