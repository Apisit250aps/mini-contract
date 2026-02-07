import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useContractCheck } from '@/hooks/contexts/use-contract-check'
import { Check } from '@/models/entities/check'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { Pen, Trash } from 'lucide-react'
import ContractDateForm from './contract-date-form'

export const CheckDateAction = ({ cell }: { cell: Cell<Check, unknown> }) => {
  const { onDeleteCheck, onEditCheck } = useContractCheck()
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
        <ContractDateForm
          values={{
            id: cell.row.original.id,
            date: String(cell.row.original.date),
          }}
          onSubmit={async (data) => {
            await onEditCheck(cell.row.original.id, {
              contractId: cell.row.original.contractId,
              date: new Date(data.date),
            })
          }}
        />
      </ModalDialog>
      <ConfirmDialog
        title={'Delete Check!'}
        description="Are you sure you want to delete this check? This action cannot be undone."
        trigger={
          <DropdownMenuItem variant={'destructive'}>
            <Trash /> Delete
          </DropdownMenuItem>
        }
        onConfirm={() => onDeleteCheck(cell.row.original.id)}
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
