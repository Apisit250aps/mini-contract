import {
  createUserService,
  deleteUserService,
  getAllUserService,
  getUserService,
  updateUserService,
} from '@/services/user'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useUserQuery = () => {
  const list = useQuery({
    queryKey: ['USER', 'LIST_USER'],
    queryFn: getAllUserService,
    initialData: [],
  })

  const get = useMutation({
    mutationKey: ['USER', 'GET_USER'],
    mutationFn: getUserService,
  })

  const created = useMutation({
    mutationKey: ['USER', 'CREATE_USER'],
    mutationFn: createUserService,
  })

  const updated = useMutation({
    mutationKey: ['USER', 'UPDATE_USER'],
    mutationFn: updateUserService,
  })

  const deleted = useMutation({
    mutationKey: ['USER', 'DELETE_USER'],
    mutationFn: deleteUserService,
  })

  return {
    list,
    get,
    created,
    updated,
    deleted,
  }
}
