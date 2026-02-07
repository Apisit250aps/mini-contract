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

import { createCheckService, updateCheckService } from '@/services/check'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import ContractDateForm from '@/components/app/contract/contract-date-form'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { ContractDetail } from '@/models/entities/contract'

export default function ContractWorkerChecker({
  contract,
}: {
  contract: ContractDetail
}) {
  const queryClient = useQueryClient()
  const { closeAll } = useOverlay()
  const contractId = contract.id
  const createCheckMutation = useMutation({
    mutationFn: createCheckService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['CONTRACT', 'GET_CONTRACT', contractId],
      })
      toast.success('New check date created successfully')
    },
    onError: (error) => {
      toast.error('Error occurred: ' + error.message)
    },
  })

  const updateCheckMutation = useMutation({
    mutationFn: updateCheckService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['CONTRACT', 'GET_CONTRACT', contractId],
      })
      queryClient.invalidateQueries({ queryKey: ['CHECK_STATS', contractId] })
      toast.success('Check status updated successfully')
    },
    onError: (error) => {
      toast.error('Error occurred: ' + error.message)
    },
  })

  const handleAddNewCheckDate = useCallback(
    ({ date }: { date: Date }) => {
      createCheckMutation.mutate({
        data: {
          contractId: contractId,
          date: date,
          workersChecked: [],
        },
      })
      closeAll()
    },
    [contractId, createCheckMutation, closeAll],
  )

  const handleWorkerCheck = useCallback(
    (checkId: string, workerId: string, isChecked: boolean) => {
      updateCheckMutation.mutate({
        checkId,
        workerId,
        isChecked,
      })
    },
    [updateCheckMutation],
  )

  return (
    <Table className="w-auto">
      <TableHeader>
        <TableRow>
          <TableHead>Workers</TableHead>
          {contract?.checked.map((item, idx) => (
            <TableHead key={idx} className="text-center relative group">
              <div className="flex items-center justify-center gap-2">
                <span>{new Date(item.date).toLocaleDateString()}</span>
                {contract.checked.length > 1 && (
                  <Button
                    size={'sm'}
                    variant="ghost"
                    className="p-0 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </Button>
                )}
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
                  disabled={createCheckMutation.isPending}
                >
                  <Plus />
                </Button>
              }
            >
              <ContractDateForm
                onSubmit={(data) => {
                  handleAddNewCheckDate({ date: new Date(data.date) })
                }}
              />
            </ModalDialog>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contract?.workersDetail.map((worker) => (
          <TableRow key={worker.id}>
            <TableCell className="">{worker.name}</TableCell>
            {contract?.checked.map((item, idx) => (
              <TableCell key={idx} className="text-center align-middle">
                <Checkbox
                  checked={item.workersChecked.includes(worker.id)}
                  onCheckedChange={(checked) => {
                    handleWorkerCheck(item.id, worker.id, !!checked)
                  }}
                  disabled={updateCheckMutation.isPending}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
