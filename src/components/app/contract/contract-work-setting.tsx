'use client'

import DataTable from '@/components/share/table/data-table'
import { checkDateColumn } from './check-date-column'
import { useContractCheck } from '@/hooks/contexts/use-contract-check'

export default function ContractWorkSetting() {
  const { contract } = useContractCheck()
  if (!contract) return null
  return <DataTable columns={checkDateColumn} data={contract.checked} />
}
