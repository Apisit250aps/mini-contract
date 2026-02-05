import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@/models/entities/user'
import { Cell, ColumnDef } from '@tanstack/react-table'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Pen, Trash } from 'lucide-react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import UserForm, { UserFormDataValues } from './user-form'
import { useUserQuery } from '@/hooks/use-user'
import { useCallback } from 'react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import { Button } from '@/components/ui/button'
import { IconDotsVertical } from '@tabler/icons-react'
import { toast } from 'sonner'
import { onErrorMessage } from '@/lib/utils'

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
              toast.success('User updated successfully.')
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
            toast.success('User deleted successfully.')
            list.refetch()
            closeAll()
          }
        },
      },
    )
  }, [deleted, cell.row.original.id, list, closeAll])

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
        <ConfirmDialog
          title={'Delete User!'}
          description="Are you sure you want to delete this user? This action cannot be undone."
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

export const userColumns: ColumnDef<User>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Is Active', accessorKey: 'isActive' },
  { header: 'Last Login', accessorKey: 'lastLogin' },
  { header: 'Created At', accessorKey: 'createdAt' },
  { header: 'Updated At', accessorKey: 'updatedAt' },
  { header: 'Actions', cell: ColumnActions },
]
