'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type OverlayContextValue = {
  open: Record<string, boolean>
  openOverlay: (id: string) => void
  closeOverlay: (id: string) => void
  closeAll: () => void
}

const OverlayContext = createContext<OverlayContextValue | null>(null)

export const DIALOG_KEY = {
  MODAL_DIALOG: 'MODAL_DIALOG',
  ALERT_DIALOG: 'ALERT_DIALOG',
  CONFIRM_DIALOG: 'CONFIRM_DIALOG',
  FORM_DIALOG: 'FORM_DIALOG',
  CUSTOM_DIALOG: 'CUSTOM_DIALOG',
} as const

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const openOverlay = useCallback((id: string) => {
    setOpen((s) => ({ ...s, [id]: true }))
  }, [])

  const closeOverlay = useCallback((id: string) => {
    setOpen((s) => ({ ...s, [id]: false }))
  }, [])

  const closeAll = useCallback(() => {
    setOpen({})
  }, [])

  return (
    <OverlayContext.Provider
      value={{ open, openOverlay, closeOverlay, closeAll }}
    >
      {children}
    </OverlayContext.Provider>
  )
}

export function useOverlay() {
  const ctx = useContext(OverlayContext)
  if (!ctx) {
    throw new Error('useOverlay must be used inside OverlayProvider')
  }
  return ctx
}
