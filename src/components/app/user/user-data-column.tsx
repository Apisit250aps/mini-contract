import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { User } from '@/models/entities/user'
import { Cell, ColumnDef } from '@tanstack/react-table'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Pen } from 'lucide-react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import UserForm, { UserFormDataValues } from './user-form'
import { useUserQuery } from '@/hooks/use-user'
import { useCallback } from 'react'

const ColumnActions = ({ cell }: { cell: Cell<User, unknown> }) => {
  const { closeAll } = useOverlay()
  const { updated, list } = useUserQuery()
  const onEdit = useCallback(
    async (data: UserFormDataValues) => {
      await updated.mutateAsync({
        id: cell.row.original.id,
        data: {
          name: data.name!,
          isActive: data.isActive!,
          ...(data.password ? { password: data.password } : {}),
        },
      })
      await list.refetch()
      closeAll()
    },
    [cell.row.original.id, updated, closeAll, list],
  )
  return (
    <ActionDropdown>
      <ModalDialog
        title={'Edit User'}
        description="Modify the user information as needed."
        closeOutside={false}
        trigger={
          <DropdownMenuItem>
            <Pen /> Edit
          </DropdownMenuItem>
        }
      >
        <UserForm values={cell.row.original} onSubmit={onEdit} />
      </ModalDialog>
    </ActionDropdown>
  )
}

export const userColumns: ColumnDef<User>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Is Active', accessorKey: 'isActive' },
  { header: 'Last Login', accessorKey: 'lastLogin' },
  { header: 'Created At', accessorKey: 'createdAt' },
  { header: 'Updated At', accessorKey: 'updatedAt' },
  { header: 'Actions', cell: ColumnActions },
]
