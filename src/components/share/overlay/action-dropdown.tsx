import { Button } from '@/components/ui/button'
import { useOverlay, DIALOG_KEY } from '@/hooks/contexts/use-overlay'
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'

import { IconDotsVertical } from '@tabler/icons-react'

export const ActionDropdown = ({
  children,
  key,
}: {
  children?: React.ReactNode
  key?: string
}) => {
  const { open, openOverlay, closeOverlay } = useOverlay()
  const KEY = `${DIALOG_KEY.ACTION_DROPDOWN}_${key}`
  return (
    <DropdownMenu
      open={open[KEY] || false}
      onOpenChange={(v) =>
        v
          ? openOverlay(KEY)
          : closeOverlay(KEY)
      }
    >
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.preventDefault()
          openOverlay(KEY)
        }}
      >
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
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
