import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { Check } from '@/models/entities/check'
import { deleteCheckService } from '@/services/check'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { Pen, Trash } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'

export const CheckDateAction = ({ cell }: { cell: Cell<Check, unknown> }) => {
  const { closeAll } = useOverlay()
  const queryClient = useQueryClient()
  const checked = useMutation({
    mutationFn: deleteCheckService,
  })

  const onDelete = useCallback(() => {
    checked.mutate(
      { checkId: cell.row.original.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              'CONTRACT',
              'GET_CONTRACT',
              cell.row.original.contractId,
            ],
          })
          toast.success('Check date deleted successfully')
        },
      },
    )

    closeAll()
  }, [
    checked,
    cell.row.original.id,
    cell.row.original.contractId,
    closeAll,
    queryClient,
  ])

  return (
    <ActionDropdown id={cell.row.original.id}>
      <ModalDialog
        title={'Edit Check'}
        description="Modify the check information as needed."
        closeOutside={false}
        dialogKey="EDIT_CHECK_MODAL"
        trigger={
          <DropdownMenuItem>
            <Pen /> Edit
          </DropdownMenuItem>
        }
      >
        {/* <CheckForm values={cell.row.original} onSubmit={onEdit} /> */}
      </ModalDialog>
      <ConfirmDialog
        title={'Delete Check!'}
        description="Are you sure you want to delete this check? This action cannot be undone."
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

export const checkDateColumn: ColumnDef<Check>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      return <span>{date.toLocaleDateString()}</span>
    },
  },
  {
    accessorKey: 'workersChecked',
    header: 'Workers Checked',
    cell: ({ row }) => {
      return <span>{row.original.workersChecked.length}</span>
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: CheckDateAction,
  },
]
