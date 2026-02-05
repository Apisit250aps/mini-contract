import ContractDataTable from '@/components/app/contract/contract-data-table'
import PageLayout from '@/components/layouts/page-layout'

export default function ContractView() {
  return (
    <PageLayout title="Contracts" actions={<button>Add Contract</button>}>
      <ContractDataTable />
    </PageLayout>
  )
}
