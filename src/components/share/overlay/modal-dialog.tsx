import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DIALOG_KEY, useOverlay } from '@/hooks/contexts/use-overlay'
import React from 'react'

type ModalDialogProps = {
  title: string
  description?: string
  trigger?: React.ReactNode
  children?: React.ReactNode
  closeOutside?: boolean
}

export default function ModalDialog({
  title,
  description,
  trigger,
  children,
  closeOutside = true,
}: ModalDialogProps) {
  const { open, closeOverlay, openOverlay } = useOverlay()
  return (
    <Dialog
      open={open[DIALOG_KEY.MODAL_DIALOG] || false}
      onOpenChange={(v) =>
        v
          ? openOverlay(DIALOG_KEY.MODAL_DIALOG)
          : closeOverlay(DIALOG_KEY.MODAL_DIALOG)
      }
    >
      {trigger && (
        <DialogTrigger
          asChild
          onClick={(e) => {
            e.preventDefault()
            openOverlay(DIALOG_KEY.MODAL_DIALOG)
          }}
        >
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent
        onInteractOutside={closeOutside ? undefined : (e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
