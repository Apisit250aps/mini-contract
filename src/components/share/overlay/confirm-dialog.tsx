import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { DIALOG_KEY, useOverlay } from '@/hooks/contexts/use-overlay'

type ConfirmDialogProps = {
  title: string
  description?: string
  trigger?: React.ReactNode
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
}

export function ConfirmDialog({
  title,
  description,
  trigger,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Continue',
}: ConfirmDialogProps) {
  const { openOverlay, open, closeOverlay } = useOverlay()
  return (
    <AlertDialog
      open={open[DIALOG_KEY.CONFIRM_DIALOG] || false}
      onOpenChange={(v) =>
        v
          ? openOverlay(DIALOG_KEY.CONFIRM_DIALOG)
          : closeOverlay(DIALOG_KEY.CONFIRM_DIALOG)
      }
    >
      {trigger && (
        <AlertDialogTrigger
          asChild
          onClick={(e) => {
            e.preventDefault()
            openOverlay(DIALOG_KEY.CONFIRM_DIALOG)
          }}
        >
          {trigger}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => closeOverlay(DIALOG_KEY.CONFIRM_DIALOG)}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
