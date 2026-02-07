'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Plus } from 'lucide-react'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import ContractDateForm from '@/components/app/contract/contract-date-form'
import { useContractCheck } from '@/hooks/contexts/use-contract-check'
import { formatShortDateToThai } from '@/lib/utils/formatter';

export default function ContractWorkerChecker() {
  const { contract, addCheckDate, workerCheck } = useContractCheck()

  if (!contract) return null

  const nextDate = (date: Date): string => {
    if (date) {
      const result = new Date(date)
      result.setDate(result.getDate() + 1)
      return result.toISOString()
    }
    return new Date().toISOString()
  }

  return (
    <Table className="w-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 bg-white z-10">Workers</TableHead>
          {contract?.checked.map((item, idx) => (
            <TableHead key={idx} className="text-center relative group">
              <div className="flex items-center justify-center gap-2">
                <span>{formatShortDateToThai(new Date(item.date))}</span>
                {/* {contract.checked.length > 1 && (
                  <Button
                    size={'sm'}
                    variant="ghost"
                    className="p-0 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </Button>
                )} */}
              </div>
            </TableHead>
          ))}
          <TableHead>
            <ModalDialog
              title={'New Date'}
              description="new check date for contract workers"
              dialogKey="NEW_DATE"
              trigger={
                <Button
                  size={'sm'}
                  variant="ghost"
                  className="p-0 w-8 h-8 rounded-full flex justify-center items-center"
                >
                  <Plus />
                </Button>
              }
            >
              <ContractDateForm
                values={{
                  date: nextDate(
                    new Date(
                      contract.checked[contract.checked.length - 1]?.date,
                    ),
                  ),
                }}
                onSubmit={(data) => {
                  addCheckDate({ date: new Date(data.date) })
                }}
              />
            </ModalDialog>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contract?.workersDetail.map((worker) => (
          <TableRow key={worker.id}>
            <TableCell className="sticky left-0 bg-white z-10">
              {worker.name}
            </TableCell>
            {contract?.checked.map((item, idx) => (
              <TableCell key={idx} className="text-center align-middle ">
                <Checkbox
                  checked={item.workersChecked.includes(worker.id)}
                  onCheckedChange={(checked) => {
                    workerCheck(item.id, worker.id, !!checked)
                  }}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
