import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { User } from '@/models/entities/user'
import { Cell, ColumnDef } from '@tanstack/react-table'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Pen, Trash } from 'lucide-react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import UserForm, { UserFormDataValues } from './user-form'
import { useUserQuery } from '@/hooks/use-user'
import { useCallback } from 'react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import { toast } from 'sonner'
import { onErrorMessage } from '@/lib/utils'
import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { TableDateTimeCell } from '@/components/share/table/table-cell'

const ColumnActions = ({ cell }: { cell: Cell<User, unknown> }) => {
  const { closeAll } = useOverlay()
  const { updated, list, deleted } = useUserQuery()
  const onEdit = useCallback(
    async (data: UserFormDataValues) => {
      await updated.mutateAsync(
        {
          id: cell.row.original.id,
          data: {
            name: data.name!,
            isActive: data.isActive!,
            ...(data.password ? { password: data.password } : {}),
          },
        },
        {
          onSettled(_data, error) {
            if (error) {
              toast.error(onErrorMessage(error))
            } else {
              toast.success('อัปเดตผู้ใช้สำเร็จ')
              list.refetch()
              closeAll()
            }
          },
        },
      )

      await list.refetch()
      closeAll()
    },
    [cell.row.original.id, updated, closeAll, list],
  )

  const onDelete = useCallback(async () => {
    await deleted.mutateAsync(
      {
        id: cell.row.original.id,
      },
      {
        onSettled(error) {
          if (error) {
            toast.error(onErrorMessage(error))
          } else {
            toast.success('ลบผู้ใช้สำเร็จ')
            list.refetch()
            closeAll()
          }
        },
      },
    )
  }, [deleted, cell.row.original.id, list, closeAll])

  return (
    <ActionDropdown id={cell.row.original.id}>
      <ModalDialog
        title={'แก้ไขผู้ใช้'}
        description="แก้ไขข้อมูลผู้ใช้ตามที่ต้องการ"
        closeOutside={false}
        trigger={
          <DropdownMenuItem>
            <Pen /> แก้ไข
          </DropdownMenuItem>
        }
      >
        <UserForm values={cell.row.original} onSubmit={onEdit} />
      </ModalDialog>
      <ConfirmDialog
        title={'ลบผู้ใช้!'}
        description="คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
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

export const userColumns: ColumnDef<User>[] = [
  { header: 'ชื่อ', accessorKey: 'name' },
  { header: 'ใช้งานอยู่', accessorKey: 'isActive' },
  {
    header: 'เข้าสู่ระบบล่าสุด',
    accessorKey: 'lastLogin',
    cell: TableDateTimeCell,
  },
  { header: 'สร้างเมื่อ', accessorKey: 'createdAt', cell: TableDateTimeCell },
  { header: 'อัปเดตเมื่อ', accessorKey: 'updatedAt', cell: TableDateTimeCell },
  { header: 'Actions', cell: ColumnActions },
]
