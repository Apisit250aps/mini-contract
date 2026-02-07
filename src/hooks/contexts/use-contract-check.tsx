'use client'

import { ContractDetail } from '@/models/entities/contract'
import { createCheckService, updateCheckService } from '@/services/check'
import { getContractService } from '@/services/contract'
import {
  RefetchOptions,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query'
import { createContext, useCallback, useContext } from 'react'
import { toast } from 'sonner'
import { useOverlay } from './use-overlay'

type ContractCheckContextValue = {
  contract: ContractDetail | undefined
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<UseQueryResult<ContractDetail, unknown>>
  addCheckDate: ({ date }: { date: Date }) => void
  workerCheck: (checkId: string, workerId: string, isChecked: boolean) => void
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
  const queryClient = useQueryClient()
  const { closeAll } = useOverlay()

  const { data: contract, refetch } = useQuery({
    queryKey: ['CONTRACT', 'GET_CONTRACT', contractId],
    queryFn: () => getContractService({ id: contractId }),
  })

  const createCheck = useMutation({
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

  const updateCheck = useMutation({
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

  const addCheckDate = useCallback(
    ({ date }: { date: Date }) => {
      createCheck.mutate({
        data: {
          contractId: contractId,
          date: date,
          workersChecked: [],
        },
      })
      closeAll()
    },
    [createCheck, contractId, closeAll],
  )

  const workerCheck = useCallback(
    (checkId: string, workerId: string, isChecked: boolean) => {
      updateCheck.mutate({
        checkId,
        workerId,
        isChecked,
      })
    },
    [updateCheck],
  )

  return (
    <ContractCheckContext.Provider
      value={{ contract, refetch, addCheckDate, workerCheck }}
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
