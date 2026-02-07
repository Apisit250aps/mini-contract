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
  date: z.string(),
})
type ContractDateFormDataValues = z.infer<typeof ContractDateSchema>
export default function ContractDateForm({
  onSubmit,
}: {
  onSubmit: (data: ContractDateFormDataValues) => void
}) {
  const methods = useForm({
    resolver: zodResolver(ContractDateSchema),
    defaultValues: { date: '' },
  })

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={methods.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Contract date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
