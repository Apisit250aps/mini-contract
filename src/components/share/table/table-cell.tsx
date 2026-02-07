import { TableCell } from '@/components/ui/table'
import {
  formatDatetimeToThai,
  formatDateToThai,
  formatShortDateToThai,
} from '@/lib/utils/formatter'
import { Cell } from '@tanstack/react-table'

export function TableDateCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  return <TableCell>{formatDateToThai(cell.getValue() as string)}</TableCell>
}

export function TableDateTimeCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  return (
    <TableCell>{formatDatetimeToThai(cell.getValue() as string)}</TableCell>
  )
}

export function TableShortDateThai<T>({ cell }: { cell: Cell<T, unknown> }) {
  return (
    <TableCell>{formatShortDateToThai(cell.getValue() as string)}</TableCell>
  )
}

export function TableTextCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  return <TableCell>{cell.getValue() as string}</TableCell>
}

export function TableBooleanCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  const value = cell.getValue() as boolean
  return <TableCell>{value ? 'ใช่' : 'ไม่ใช่'}</TableCell>
}

export function TableNumberCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  return <TableCell>{cell.getValue() as number}</TableCell>
}
