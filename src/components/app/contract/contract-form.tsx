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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Contract title" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Contract description" {...field} />
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
                <FormLabel>Employer</FormLabel>
                <FormControl>
                  <Input placeholder="Employer name" {...field} />
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
                <FormLabel>Start Date</FormLabel>
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
                <FormLabel>End Date</FormLabel>
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
                <FormLabel>Is Active</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="workers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workers</FormLabel>
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
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
