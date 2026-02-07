'use client'

import { ContractDetail } from '@/models/entities/contract'
import { getContractService } from '@/services/contract'
import { RefetchOptions, useQuery, UseQueryResult } from '@tanstack/react-query'
import { createContext, useCallback, useContext } from 'react'
import { toast } from 'sonner'
import { useOverlay } from './use-overlay'
import { useContractQuery } from '../use-contract'
import { Check } from '@/models/entities/check'

type ContractCheckContextValue = {
  contract: ContractDetail | undefined
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<UseQueryResult<ContractDetail, unknown>>
  addCheckDate: ({ date }: { date: Date }) => void
  workerCheck: (
    checkId: string,
    workerId: string,
    isChecked: boolean,
  ) => Promise<void>
  onDeleteCheck: (checkId: string) => Promise<void>
  onEditCheck: (checkId: string, data: Partial<Check>) => Promise<Check>
}

const ContractCheckContext = createContext<ContractCheckContextValue | null>(
  null,
)

export function ContractCheckProvider({
  children,
  contractId,
}: {
  contractId: string
  children: React.ReactNode
}) {
  const { closeAll } = useOverlay()
  const { createCheck, updateCheck, deleteCheck, editCheck } =
    useContractQuery()

  const { data: contract, refetch } = useQuery({
    queryKey: ['CONTRACT', 'GET_CONTRACT', contractId],
    queryFn: () => getContractService({ id: contractId }),
  })

  const addCheckDate = useCallback(
    async ({ date }: { date: Date }) => {
      await createCheck.mutateAsync(
        {
          data: {
            contractId: contractId,
            date: date,
            workersChecked: [],
          },
        },
        {
          onSuccess: () => {
            toast.success('เพิ่มวันเช็คชื่อสำเร็จ')
            refetch()
            closeAll()
          },
        },
      )
    },
    [createCheck, contractId, refetch, closeAll],
  )

  const workerCheck = useCallback(
    async (checkId: string, workerId: string, isChecked: boolean) => {
      await updateCheck.mutateAsync(
        {
          checkId,
          workerId,
          isChecked,
        },
        {
          onSuccess: () => {
            toast.success('อัปเดตการเช็คชื่อพนักงานสำเร็จ')
            refetch()
            closeAll()
          },
        },
      )
    },
    [closeAll, updateCheck, refetch],
  )

  const onDeleteCheck = useCallback(
    async (checkId: string) => {
      await deleteCheck.mutateAsync(
        { checkId },
        {
          onSuccess: () => {
            toast.success('ลบวันเช็คชื่อสำเร็จ')
            closeAll()
            refetch()
          },
        },
      )
    },
    [closeAll, deleteCheck, refetch],
  )

  const onEditCheck = useCallback(
    async (checkId: string, data: Partial<Check>) => {
      return editCheck.mutateAsync(
        { checkId, data },
        {
          onSuccess: (updated) => {
            toast.success('อัปเดตวันเช็คชื่อสำเร็จ')
            closeAll()
            refetch()
            return updated
          },
        },
      )
    },
    [closeAll, editCheck, refetch],
  )

  return (
    <ContractCheckContext.Provider
      value={{
        contract,
        refetch,
        addCheckDate,
        workerCheck,
        onDeleteCheck,
        onEditCheck,
      }}
    >
      {children}
    </ContractCheckContext.Provider>
  )
}

export function useContractCheck() {
  const ctx = useContext(ContractCheckContext)
  if (!ctx) {
    throw new Error(
      'useContractCheck must be used inside ContractCheckProvider',
    )
  }
  return ctx
}
