import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const ContractDateSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
})
export type ContractDateFormDataValues = z.infer<typeof ContractDateSchema>

export default function ContractDateForm({
  onSubmit,
  values,
}: {
  values: ContractDateFormDataValues
  onSubmit: (data: ContractDateFormDataValues) => void
}) {
  const methods = useForm({
    resolver: zodResolver(ContractDateSchema),
    defaultValues: {
      date: new Date(values.date).toISOString().substring(0, 10),
      id: values?.id || undefined,
    },
  })

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={methods.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วันที่</FormLabel>
              <FormControl>
                <Input type="date" placeholder="วันที่สัญญา" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">ส่ง</Button>
        </div>
      </form>
    </Form>
  )
}
