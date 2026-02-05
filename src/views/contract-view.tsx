'use client'
import ContractDataTable from '@/components/app/contract/contract-data-table'
import ContractForm, {
  ContractFormDataValues,
} from '@/components/app/contract/contract-form'
import PageLayout from '@/components/layouts/page-layout'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import { Button } from '@/components/ui/button'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { useContractQuery } from '@/hooks/use-contract'
import { Plus } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'

export default function ContractView() {
  const { closeAll } = useOverlay()
  const { created, list } = useContractQuery()

  const onSubmit = useCallback(
    async (data: ContractFormDataValues) => {
      await created.mutateAsync(
        {
          data: {
            title: data.title,
            description: data.description,
            employer: data.employer,
            startDate: data.startDate,
            endDate: data.endDate,
            isActive: data.isActive,
            workers: data.workers,
            size: data.size,
          },
        },
        {
          onSettled(data, error) {
            if (error) {
              toast.error(error.message)
            } else {
              toast.success('Contract created successfully.')
              list.refetch()
              closeAll()
            }
          },
        },
      )
    },
    [closeAll, created, list],
  )
  return (
    <PageLayout
      title="Contracts"
      actions={
        <ModalDialog
          title={'Add Contract'}
          description="Modify the contract information as needed."
          closeOutside={false}
          dialogKey='ADD_CONTRACT_MODAL'
          trigger={
            <Button>
              <Plus /> Add Contract
            </Button>
          }
        >
          <div className="scrollbar h-[80vh] sm:max-w-500 overflow-auto px-2 pb-4">
            <ContractForm onSubmit={onSubmit} />
          </div>
        </ModalDialog>
      }
    >
      <ContractDataTable />
    </PageLayout>
  )
}
