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
}: {
  children?: React.ReactNode
}) => {
  const { open, openOverlay, closeOverlay } = useOverlay()
  return (
    <DropdownMenu
      open={open[DIALOG_KEY.ACTION_DROPDOWN] || false}
      onOpenChange={(v) =>
        v
          ? openOverlay(DIALOG_KEY.ACTION_DROPDOWN)
          : closeOverlay(DIALOG_KEY.ACTION_DROPDOWN)
      }
    >
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.preventDefault()
          openOverlay(DIALOG_KEY.ACTION_DROPDOWN)
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
