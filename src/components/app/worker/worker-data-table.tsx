'use client'
import DataTable from '@/components/share/table/data-table'
import React from 'react'
import { workerColumns } from './worker-data-column'
import { useWorkerQuery } from '@/hooks/use-worker'

export default function WorkerDataTable() {
  const columns = React.useMemo(() => workerColumns, [])
  const workers = useWorkerQuery()
  return <DataTable data={workers.list.data} columns={columns} />
}
