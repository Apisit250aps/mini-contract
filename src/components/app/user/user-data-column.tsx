import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@/models/entities/user'
import { IconDotsVertical } from '@tabler/icons-react'
import { Cell, ColumnDef } from '@tanstack/react-table'
import ModalDialog from '@/components/share/overlay/modal-dialog'

const ColumnActions = ({ cell }: { cell: Cell<User, unknown> }) => {
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
          title={'Hello'}
          description="lorem"
          closeOutside={false}
          trigger={<DropdownMenuItem>Edit</DropdownMenuItem>}
        >
          Test
        </ModalDialog>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
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
