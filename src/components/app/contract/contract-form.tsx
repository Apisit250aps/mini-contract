'use client'
import React, { useMemo } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import DataTable from '@/components/share/table/data-table'
import { useWorkerQuery } from '@/hooks/use-worker'
import { selectWorkerColumn } from '../worker/worker-data-column'
import { Button } from '@/components/ui/button'

const ContractFormSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1024).optional(),
  employer: z.string().max(255).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isActive: z.boolean(),
  workers: z.array(z.uuid()).optional(),
  size: z.number().optional(),
})

export type ContractFormDataValues = z.infer<typeof ContractFormSchema>

export default function ContractForm({
  values,
  onSubmit,
}: {
  values?: Partial<ContractFormDataValues>
  onSubmit: (data: ContractFormDataValues) => void
}) {
  const defaultValues = useMemo(
    () => ({
      title: values?.title || '',
      description: values?.description || '',
      employer: values?.employer || '',
      startDate: values?.startDate ? new Date(values.startDate) : new Date(),
      endDate: values?.endDate ? new Date(values.endDate) : new Date(),
      isActive: values?.isActive ?? true,
      workers: values?.workers || [],
      size: values?.size || 0,
    }),
    [values],
  )

  const methods = useForm<ContractFormDataValues>({
    resolver: zodResolver(ContractFormSchema),
    defaultValues,
  })

  const { list } = useWorkerQuery()

  const handleSubmit = useMemo(
    () => methods.handleSubmit((data) => onSubmit(data)),
    [methods, onSubmit],
  )

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit}>
        {/* Form fields go here */}
        <div className="space-y-4">
          <FormField
            control={methods.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หัวข้อ</FormLabel>
                <FormControl>
                  <Input placeholder="หัวข้อสัญญา" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รายละเอียด</FormLabel>
                <FormControl>
                  <Textarea placeholder="รายละเอียดสัญญา" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="employer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>นายจ้าง</FormLabel>
                <FormControl>
                  <Input placeholder="ชื่อนายจ้าง" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่เริ่มต้น</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value?.toISOString().split('T')[0] || ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่สิ้นสุด</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value?.toISOString().split('T')[0] || ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>ใช้งานอยู่</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="workers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>คนงาน</FormLabel>
                <FormControl>
                  <DataTable
                    columns={selectWorkerColumn}
                    data={list.data || []}
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            ส่ง
          </Button>
        </div>
      </form>
    </Form>
  )
}
