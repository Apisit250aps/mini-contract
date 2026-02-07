'use client'

import ContractWorkSetting from '@/components/app/contract/contract-work-setting'
import ContractWorkerChecker from '@/components/app/contract/contract-worker-checker'
import PageLayout from '@/components/layouts/page-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getContractService } from '@/services/contract'
import { useQuery } from '@tanstack/react-query'
import { CalendarCheck2, Settings2 } from 'lucide-react'

export default function ContractDetailView({
  contractId,
}: {
  contractId: string
}) {
  const { data: contract } = useQuery({
    queryKey: ['CONTRACT', 'GET_CONTRACT', contractId],
    queryFn: () => getContractService({ id: contractId }),
  })
  
  return (
    <PageLayout title={`Contract Detail`}>
      <Tabs defaultValue="check" className="w-full h-100">
        <TabsList>
          <TabsTrigger value="check">
            <CalendarCheck2 />
            Check
          </TabsTrigger>
          <TabsTrigger value="setting">
            <Settings2 />
            Setting
          </TabsTrigger>
        </TabsList>
        <TabsContent value="check">
          {contract && <ContractWorkerChecker contract={contract} />}
        </TabsContent>
        <TabsContent value="setting">
          {contract && <ContractWorkSetting contract={contract} />}
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
