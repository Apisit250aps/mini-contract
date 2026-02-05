import React from 'react'

import WorkerDataTable from '@/components/app/worker/worker-data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function WorkerView() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Workers</CardTitle>
        </div>
        <CardDescription>List of all workers in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <WorkerDataTable />
      </CardContent>
    </Card>
  )
}
