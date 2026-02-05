import { Button } from '@/components/ui/button'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'

import { IconDotsVertical } from '@tabler/icons-react'

export const ActionDropdown = ({
  children,
  id,
}: {
  children?: React.ReactNode
  id: string
}) => {
  const { open, openOverlay, closeOverlay } = useOverlay()
  return (
    <DropdownMenu
      key={id}
      open={open[id] || false}
      onOpenChange={(v) => (v ? openOverlay(id) : closeOverlay(id))}
    >
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.preventDefault()
          openOverlay(id)
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
