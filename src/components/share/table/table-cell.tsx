import {
  formatDatetimeToThai,
  formatDateToThai,
  formatShortDateToThai,
} from '@/lib/utils/formatter'
import { Cell } from '@tanstack/react-table'

export function TableDateCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  return <span>{formatDateToThai(cell.getValue() as string)}</span>
}

export function TableDateTimeCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  return <span>{formatDatetimeToThai(cell.getValue() as string)}</span>
}

export function TableShortDateThai<T>({ cell }: { cell: Cell<T, unknown> }) {
  return <span>{formatShortDateToThai(cell.getValue() as string)}</span>
}

export function TableTextCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  return <span>{cell.getValue() as string}</span>
}

export function TableBooleanCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  const value = cell.getValue() as boolean
  return <span>{value ? 'ใช่' : 'ไม่ใช่'}</span>
}

export function TableNumberCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  return <span>{cell.getValue() as number}</span>
}
