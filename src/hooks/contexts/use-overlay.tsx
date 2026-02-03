'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type OverlayContextValue = {
  open: Record<string, boolean>
  openOverlay: (id: string) => void
  closeOverlay: (id: string) => void
  closeAll: () => void
  setOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

const OverlayContext = createContext<OverlayContextValue | null>(null)

export const DIALOG_KEY = {
  ACTION_DROPDOWN: 'ACTION_DROPDOWN',
  MODAL_DIALOG: 'MODAL_DIALOG',
  CONFIRM_DIALOG: 'CONFIRM_DIALOG',
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
      value={{ open, openOverlay, closeOverlay, closeAll, setOpen }}
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
