import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useContractCheck } from '@/hooks/contexts/use-contract-check'
import { Check } from '@/models/entities/check'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { Calculator, Pen, Trash } from 'lucide-react'
import ContractDateForm from './contract-date-form'
import ContractCalculate from './contract-calculate'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const CheckDateAction = ({ cell }: { cell: Cell<Check, unknown> }) => {
  const { onDeleteCheck, onEditCheck } = useContractCheck()
  return (
    <ActionDropdown id={cell.row.original.id}>
      <ModalDialog
        title={'Calculate Check'}
        description="Modify the check information as needed."
        closeOutside={false}
        dialogKey="CALCULATE_CHECK_MODAL"
        trigger={
          <DropdownMenuItem>
            <Calculator /> Calculate
          </DropdownMenuItem>
        }
      >
        <ContractCalculate
          onSubmit={async (data) => {
            await onEditCheck(cell.row.original.id, {
              contractId: cell.row.original.contractId,
              weight: data.weight,
              rate: data.rate,
              amount: data.amount,
            })
          }}
        />
      </ModalDialog>
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

export const WorkerSalary = ({ cell }: { cell: Cell<Check, unknown> }) => {
  const { contract } = useContractCheck()
  const workersCount = contract?.workersDetail.length || 0
  const averageSalary =
    workersCount > 0 ? cell.row.original.amount / workersCount : 0

  return (
    <ModalDialog
      title={'Salary Details'}
      description="Average salary calculation for this check date."
      closeOutside={true}
      dialogKey="SALARY_DETAILS_MODAL"
      trigger={
        <Button variant="ghost" asChild>
          <span className="">{averageSalary.toFixed(2)}</span>
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workers</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contract?.workersDetail.map((worker) => (
            <TableRow key={worker.id}>
              <TableCell>{worker.name}</TableCell>
              <TableCell>
                {cell.row.original.workersChecked.includes(worker.id)
                  ? averageSalary.toFixed(2)
                  : '0.00'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalDialog>
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
    accessorKey: 'weight',
    header: 'Weight (Kg)',
    cell: ({ row }) => {
      return <span>{row.original.weight}</span>
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      return <span>{row.original.amount}</span>
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
    header: 'Avg.',
    cell: WorkerSalary,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: CheckDateAction,
  },
]
