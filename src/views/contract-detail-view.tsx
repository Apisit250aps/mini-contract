'use client'

import PageLayout from '@/components/layouts/page-layout'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { getContractService } from '@/services/contract'
import { useQuery } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CheckDate {
  date: string
  workers: string[]
}

export default function ContractDetailView({ contractId }: { contractId: string }) {
  const { data: contract } = useQuery({
    queryKey: ['CONTRACT', 'GET_CONTRACT', contractId],
    queryFn: () => getContractService({ id: contractId }),
  })
  const [check, setCheck] = useState<CheckDate[]>([
    {
      date: '2024-01-01',
      workers: [],
    },
  ])

  const addNewDate = () => {
    const today = new Date().toISOString().split('T')[0]
    // ป้องกันไม่ให้เพิ่มวันซ้ำ
    if (!check.some((item) => item.date === today)) {
      setCheck(
        [...check, { date: today, workers: [] }].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      )
    }
  }

  const removeDate = (dateToRemove: string) => {
    if (check.length > 1) {
      setCheck(check.filter((item) => item.date !== dateToRemove))
    }
  }

  useEffect(() => {
    console.log('check', check)
  }, [check])

  return (
    <PageLayout title={`Contract Detail`}>
      <Table className="w-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Workers</TableHead>
            {check.map((item) => (
              <TableHead key={item.date} className="text-center relative group">
                <div className="flex items-center justify-center gap-2">
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  {check.length > 1 && (
                    <Button
                      size={'sm'}
                      variant="ghost"
                      className="p-0 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeDate(item.date)}
                    >
                      <X size={12} />
                    </Button>
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead>
              <Button
                size={'sm'}
                variant="ghost"
                className="p-0 w-8 h-8 rounded-full flex justify-center items-center"
                onClick={addNewDate}
              >
                <Plus />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contract?.workersDetail.map((worker) => (
            <TableRow key={worker.id}>
              <TableCell className="">{worker.name}</TableCell>
              {check.map((item) => (
                <TableCell key={item.date} className="text-center align-middle">
                  <Checkbox
                    checked={item.workers.includes(worker.id)}
                    onCheckedChange={(checked) => {
                      setCheck(
                        check.map((c) =>
                          c.date === item.date
                            ? {
                                ...c,
                                workers: checked
                                  ? [...c.workers, worker.id]
                                  : c.workers.filter((id) => id !== worker.id),
                              }
                            : c,
                        ),
                      )
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageLayout>
  )
}
