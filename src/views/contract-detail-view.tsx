'use client'

import ContractWorkerChecker from '@/components/app/contract/contract-worker-checker'
import PageLayout from '@/components/layouts/page-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ContractDetailView({
  contractId,
}: {
  contractId: string
}) {
  return (
    <PageLayout title={`Contract Detail`}>
      <Tabs defaultValue="check" className="w-full h-100">
        <TabsList>
          <TabsTrigger value="check">Check</TabsTrigger>
          <TabsTrigger value="setting">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="check">
          <ContractWorkerChecker contractId={contractId} />
        </TabsContent>
        <TabsContent value="setting">Change your password here.</TabsContent>
      </Tabs>
    </PageLayout>
  )
}
