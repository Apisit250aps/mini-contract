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
import { TableDateTimeCell } from '@/components/share/table/table-cell'

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
            toast.success('ลบสัญญาสำเร็จ.')
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
              toast.success('แก้ไขสัญญาสำเร็จ.')
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
        title={'แก้ไขสัญญา'}
        description="แก้ไขข้อมูลสัญญาตามที่ต้องการ"
        closeOutside={false}
        dialogKey="EDIT_CONTRACT_MODAL"
        trigger={
          <DropdownMenuItem>
            <Pen /> แก้ไข
          </DropdownMenuItem>
        }
      >
        <ContractForm values={cell.row.original} onSubmit={onEdit} />
      </ModalDialog>
      <ConfirmDialog
        title={'ลบสัญญา!'}
        description="คุณแน่ใจหรือไม่ว่าต้องการลบสัญญานี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
        trigger={
          <DropdownMenuItem variant={'destructive'}>
            <Trash /> ลบ
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
    header: 'หัวข้อ',
    cell: ({ row }) => (
      <Link
        href={`/dashboard/contract/${row.original.id}`}
        className="underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: 'employer',
    header: 'ผู้ว่าจ้าง',
  },
  {
    accessorKey: 'workers',
    header: 'จำนวนคนงาน',
    cell: ({ row }) => <>{row.original.workers?.length}</>,
  },
  {
    accessorKey: 'startDate',
    header: 'วันที่เริ่มต้น',
    cell: TableDateTimeCell,
  },
  {
    accessorKey: 'endDate',
    header: 'วันที่สิ้นสุด',
    cell: TableDateTimeCell,
  },
  {
    id: 'actions',
    header: 'จัดการ',
    cell: ContractAction,
  },
]
