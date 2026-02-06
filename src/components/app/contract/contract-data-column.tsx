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
import ContractForm, { ContractFormDataValues } from './contract-form'
import Link from 'next/link'

const ContractAction = ({ cell }: { cell: Cell<Contract, unknown> }) => {
  const { deleted, list, updated } = useContractQuery()
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
  const onEdit = useCallback(
    async (data: ContractFormDataValues) => {
      await updated.mutateAsync(
        {
          id: cell.row.original.id,
          data: {
            title: data.title!,
            description: data.description!,
            employer: data.employer!,
            startDate: data.startDate
              ? new Date(data.startDate)
              : data.startDate,
            endDate: data.endDate ? new Date(data.endDate) : data.endDate,
            isActive: data.isActive!,
            workers: data.workers!,
            size: data.size!,
          },
        },
        {
          onSettled(_data, error) {
            if (error) {
              toast.error(error.message)
            } else {
              toast.success('Contract updated successfully.')
              list.refetch()
              closeAll()
            }
          },
        },
      )
    },
    [cell.row.original.id, closeAll, list, updated],
  )
  return (
    <ActionDropdown id={cell.row.original.id}>
      <ModalDialog
        title={'Edit Contract'}
        description="Modify the contract information as needed."
        closeOutside={false}
        dialogKey="EDIT_CONTRACT_MODAL"
        trigger={
          <DropdownMenuItem>
            <Pen /> Edit
          </DropdownMenuItem>
        }
      >
        <ContractForm values={cell.row.original} onSubmit={onEdit} />
      </ModalDialog>
      <ConfirmDialog
        title={'Delete Contract!'}
        description="Are you sure you want to delete this contract? This action cannot be undone."
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
    cell: ({ row }) => (
      <Link href={`contract/${row.original.id}`} className='underline'>{row.original.title}</Link>
    ),
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
