import {
  createCheckService,
  deleteCheckService,
  updateCheckService,
} from '@/services/check'
import {
  createContractService,
  deleteContractService,
  getAllContractService,
  updateContractService,
} from '@/services/contract'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useContractQuery = () => {
  const list = useQuery({
    queryKey: ['CONTRACT', 'LIST_CONTRACT'],
    queryFn: getAllContractService,
    initialData: [],
  })

  const created = useMutation({
    mutationKey: ['CONTRACT', 'CREATE_CONTRACT'],
    mutationFn: createContractService,
  })

  const updated = useMutation({
    mutationKey: ['CONTRACT', 'UPDATE_CONTRACT'],
    mutationFn: updateContractService,
  })

  const deleted = useMutation({
    mutationKey: ['CONTRACT', 'DELETE_CONTRACT'],
    mutationFn: deleteContractService,
  })

  const createCheck = useMutation({
    mutationFn: createCheckService,
  })

  const updateCheck = useMutation({
    mutationFn: updateCheckService,
  })

  const deleteCheck = useMutation({
    mutationFn: deleteCheckService,
  })

  return {
    list,
    created,
    updated,
    deleted,
    createCheck,
    updateCheck,
    deleteCheck,
  }
}
