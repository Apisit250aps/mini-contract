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
              toast.success('สร้างผู้ใช้สำเร็จ')
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
          <CardTitle>ผู้ใช้</CardTitle>
          <ModalDialog
            title={'เพิ่มผู้ใช้'}
            description="แก้ไขข้อมูลผู้ใช้ตามที่ต้องการ"
            closeOutside={false}
            trigger={
              <Button>
                <Plus /> เพิ่มผู้ใช้
              </Button>
            }
          >
            <UserForm onSubmit={onSubmit} />
          </ModalDialog>
        </div>
        <CardDescription>รายชื่อผู้ใช้ทั้งหมดในระบบ</CardDescription>
      </CardHeader>
      <CardContent>
        <UserDataTable />
      </CardContent>
    </Card>
  )
}
