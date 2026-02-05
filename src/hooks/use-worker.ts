import {
  getAllWorkerService,
  getWorkerService,
  createWorkerService,
  updateWorkerService,
  deleteWorkerService,
} from '@/services/worker'
import { useQuery, useMutation } from '@tanstack/react-query'

export const useWorkerQuery = () => {
  const list = useQuery({
    queryKey: ['WORKER', 'LIST_WORKER'],
    queryFn: getAllWorkerService,
    initialData: [],
  })
  const get = useMutation({
    mutationKey: ['WORKER', 'GET_WORKER'],
    mutationFn: getWorkerService,
  })
  const created = useMutation({
    mutationKey: ['WORKER', 'CREATE_WORKER'],
    mutationFn: createWorkerService,
  })
  const updated = useMutation({
    mutationKey: ['WORKER', 'UPDATE_WORKER'],
    mutationFn: updateWorkerService,
  })
  const deleted = useMutation({
    mutationKey: ['WORKER', 'DELETE_WORKER'],
    mutationFn: deleteWorkerService,
  })
  return {
    list,
    get,
    created,
    updated,
    deleted,
  }
}
