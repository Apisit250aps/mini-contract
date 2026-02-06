'use client'
import PageLayout from '@/components/layouts/page-layout'

import { getContractService } from '@/services/contract'
import { useQuery } from '@tanstack/react-query'

export default function ContractDetailView({ id }: { id: string }) {
  const { data: contract } = useQuery({
    queryKey: ['CONTRACT', 'GET_CONTRACT', id],
    queryFn: () => getContractService({ id }),
  })

  return (
    <PageLayout title={`Contract Detail`}>
      <pre>{JSON.stringify(contract, null, 2)}</pre>
    </PageLayout>
  )
}
