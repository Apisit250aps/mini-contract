'use client'
import React, { useCallback } from 'react'

import WorkerDataTable from '@/components/app/worker/worker-data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import WorkerForm, {
  WorkerFormDataValues,
} from '@/components/app/worker/worker-form'
import { useWorkerQuery } from '@/hooks/use-worker'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { toast } from 'sonner'

export default function WorkerView() {
  const { closeAll } = useOverlay()
  const { created, list } = useWorkerQuery()

  const onSubmit = useCallback(
    async (data: WorkerFormDataValues) => {
      await created.mutateAsync(
        {
          data: {
            name: data.name,
            isActive: data.isActive,
            position: data.position,
            hiredAt: data.hiredAt ? new Date(data.hiredAt) : null,
          },
        },
        {
          onSettled(data, error) {
            if (error) {
              toast.error(error.message)
            } else {
              toast.success('สร้างพนักงานสำเร็จ')
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
          <CardTitle>พนักงาน</CardTitle>
          <ModalDialog
            title={'เพิ่มพนักงาน'}
            description="แก้ไขข้อมูลพนักงานตามที่ต้องการ"
            closeOutside={false}
            trigger={
              <Button>
                <Plus /> เพิ่มพนักงาน
              </Button>
            }
          >
            <WorkerForm onSubmit={onSubmit} />
          </ModalDialog>
        </div>
        <CardDescription>รายชื่อพนักงานทั้งหมดในระบบ</CardDescription>
      </CardHeader>
      <CardContent>
        <WorkerDataTable />
      </CardContent>
    </Card>
  )
}
