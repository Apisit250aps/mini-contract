'use client'
import React, { useMemo } from 'react'
import { useUserQuery } from '@/hooks/use-user'
import DataTable from '@/components/share/table/data-table'
import { userColumns } from './user-data-column'

export default function UserDataTable() {
  const user = useUserQuery()
  const columns = useMemo(() => userColumns, [])

  return <DataTable data={user.list.data} columns={columns} />
}
