'use client'
import DataTable from '@/components/share/table/data-table'
import React, { useMemo } from 'react'
import { contractColumns } from './contract-data-column'
import { useContractQuery } from '@/hooks/use-contract'

export default function ContractDataTable() {
  const columns = useMemo(() => contractColumns, [])
  const contracts = useContractQuery()
  return <DataTable columns={columns} data={contracts.list.data} />
}
