'use client'
import React from 'react'
import { ContractDetail } from '@/models/entities/contract'
import DataTable from '@/components/share/table/data-table'
import { checkDateColumn } from './check-date-column'

export default function ContractWorkSetting({
  contract,
}: {
  contract: ContractDetail
}) {
  const { checked } = contract
  return <DataTable columns={checkDateColumn} data={checked} />
}
