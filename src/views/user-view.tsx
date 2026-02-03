'use client'

import UserDataTable from '@/components/app/user/user-data-table'
import UserForm, { UserFormDataValues } from '@/components/app/user/user-form'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useUserQuery } from '@/hooks/use-user'
import { onErrorMessage } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'

export default function UserView() {
  const { closeAll } = useOverlay()
  const { created, list } = useUserQuery()

  const onSubmit = useCallback(
    async (data: UserFormDataValues) => {
      await created.mutateAsync(
        {
          data: {
            name: data.name,
            password: data.password,
            isActive: data.isActive,
          },
        },
        {
          onSettled(data, error) {
            if (error) {
              toast.error(error.message)
            } else {
              toast.success('User created successfully.')
              list.refetch()
              closeAll()
            }
          },
        },
      )
    },
    [closeAll, created, list],
  )
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Users</CardTitle>
          <ModalDialog
            title={'Add User'}
            description="Modify the user information as needed."
            closeOutside={false}
            trigger={
              <Button>
                <Plus /> Add User
              </Button>
            }
          >
            <UserForm onSubmit={onSubmit} />
          </ModalDialog>
        </div>
        <CardDescription>List of all users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <UserDataTable />
      </CardContent>
    </Card>
  )
}
