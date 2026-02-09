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
import { formatShortDateToThai } from '@/lib/utils/formatter'

export const CheckDateAction = ({ cell }: { cell: Cell<Check, unknown> }) => {
  const { onDeleteCheck, onEditCheck, settings } = useContractCheck()
  return (
    <ActionDropdown id={`${cell.row.original.id}-actions`}>
      <ModalDialog
        title={'คำนวณค่าจ้าง'}
        description="คำนวณค่าจ้างสำหรับวันตรวจสอบนี้"
        closeOutside={false}
        dialogKey={`CALCULATE_CHECK_MODAL-${cell.row.original.id}`}
        trigger={
          <DropdownMenuItem>
            <Calculator /> คำนวณ
          </DropdownMenuItem>
        }
      >
        <ContractCalculate
          values={{
            weight: cell.row.original.weight,
            rate: cell.row.original.rate ?? settings.rate,
          }}
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
        title={'แก้ไขเช็คชื่อรายวัน'}
        description="แก้ไขวันที่ตรวจสอบสำหรับสัญญานี้"
        closeOutside={false}
        dialogKey="EDIT_CHECK_MODAL"
        trigger={
          <DropdownMenuItem>
            <Pen /> แก้ไข
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
        title={'ลบเช็คชื่อรายวัน!'}
        description="คุณแน่ใจหรือไม่ว่าต้องการลบเช็คชื่อนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
        trigger={
          <DropdownMenuItem variant={'destructive'}>
            <Trash /> ลบ
          </DropdownMenuItem>
        }
        onConfirm={() => onDeleteCheck(cell.row.original.id)}
      />
    </ActionDropdown>
  )
}

export const WorkerSalary = ({ cell }: { cell: Cell<Check, unknown> }) => {
  const { contract } = useContractCheck()
  const workersCount = cell.row.original.workersChecked.length || 0
  const averageSalary =
    workersCount > 0 ? cell.row.original.amount / workersCount : 0

  return (
    <ModalDialog
      title={'รายละเอียดเงินค่าจ้าง'}
      description="การคำนวณเงินเดือนเฉลี่ยสำหรับวันตรวจสอบนี้"
      closeOutside={true}
      dialogKey={cell.row.original.id}
      trigger={
        <Button variant="ghost" asChild>
          <span className="">{averageSalary.toFixed(2)}</span>
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>คนงาน</TableHead>
            <TableHead>จำนวนเงิน</TableHead>
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
    header: 'วันที่',
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      return <span>{formatShortDateToThai(date)}</span>
    },
  },
  {
    accessorKey: 'weight',
    header: 'น้ำหนัก (กก.)',
    cell: ({ row }) => {
      return <span>{row.original.weight}</span>
    },
  },
  {
    accessorKey: 'amount',
    header: 'จำนวนเงิน',
    cell: ({ row }) => {
      return <span>{row.original.amount}</span>
    },
  },
  {
    accessorKey: 'workersChecked',
    header: 'จำนวนคนงานที่เช็คชื่อ',
    cell: ({ row }) => {
      return <span>{row.original.workersChecked.length}</span>
    },
  },
  {
    header: 'เฉลี่ย',
    cell: WorkerSalary,
  },
  {
    id: 'actions',
    header: 'จัดการ',
    cell: CheckDateAction,
  },
]
