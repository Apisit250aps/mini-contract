'use client'

import ContractWorkSetting from '@/components/app/contract/contract-work-setting'
import ContractWorkerChecker from '@/components/app/contract/contract-worker-checker'
import PageLayout from '@/components/layouts/page-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContractCheckProvider } from '@/hooks/contexts/use-contract-check'
import { CalendarCheck2, Settings2 } from 'lucide-react'

export default function ContractDetailView({
  contractId,
}: {
  contractId: string
}) {
  return (
    <PageLayout title={`รายละเอียดสัญญา`}>
      <ContractCheckProvider contractId={contractId}>
        <Tabs defaultValue="check" >
          <TabsList>
            <TabsTrigger value="check">
              <CalendarCheck2 />
              เช็คชื่อ
            </TabsTrigger>
            <TabsTrigger value="setting">
              <Settings2 />
              ตั้งค่า
            </TabsTrigger>
          </TabsList>
          <TabsContent value="check">
            <ContractWorkerChecker />
          </TabsContent>
          <TabsContent value="setting">
            <ContractWorkSetting />
          </TabsContent>
        </Tabs>
      </ContractCheckProvider>
    </PageLayout>
  )
}
