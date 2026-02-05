import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useContractQuery } from '@/hooks/use-contract'
import { Contract } from '@/models/entities/contract'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { Pen, Trash } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'

const ContractAction = ({ cell }: { cell: Cell<Contract, unknown> }) => {
  const { deleted, list } = useContractQuery()
  const { closeAll } = useOverlay()
  //
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
            toast.success('Contract deleted successfully.')
            list.refetch()
            closeAll()
          }
        },
      },
    )
  }, [cell.row.original.id, closeAll, deleted, list])
  //
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
        {/* <WorkerForm values={cell.row.original} onSubmit={onEdit} /> */}
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

export const contractColumns: ColumnDef<Contract>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'workers',
    header: 'Workers',
    cell: ({ row }) => <>{row.original.workers?.length}</>,
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
  },

  {
    accessorKey: 'endDate',
    header: 'End Date',
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ContractAction,
  },
]
