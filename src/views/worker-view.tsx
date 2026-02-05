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
              toast.success('Worker created successfully.')
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
          <CardTitle>Workers</CardTitle>
          <ModalDialog
            title={'Add Worker'}
            description="Modify the worker information as needed."
            closeOutside={false}
            trigger={
              <Button>
                <Plus /> Add Worker
              </Button>
            }
          >
            <WorkerForm onSubmit={onSubmit} />
          </ModalDialog>
        </div>
        <CardDescription>List of all workers in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <WorkerDataTable />
      </CardContent>
    </Card>
  )
}
