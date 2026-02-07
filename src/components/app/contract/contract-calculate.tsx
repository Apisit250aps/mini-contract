'use client'
'use no memo'
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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const ContractCalculateSchema = z.object({
  weight: z.number().min(0), // in Kg
  rate: z.number().min(0),
  amount: z.number().min(0),
})

export type ContractCalculateForm = z.infer<typeof ContractCalculateSchema>

export default function ContractCalculate({
  onSubmit,
}: {
  onSubmit?: (data: ContractCalculateForm) => Promise<void>
}) {
  const methods = useForm<ContractCalculateForm>({
    resolver: zodResolver(ContractCalculateSchema),
    defaultValues: {
      weight: 0,
      rate: 250,
      amount: 0,
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const weight = methods.watch('weight')
  const rate = methods.watch('rate')

  useEffect(() => {
    const amount = (weight / 1000) * rate
    methods.setValue('amount', Number(amount.toFixed(2)))
  }, [weight, rate, methods])

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit!)} className="space-y-4">
        <FormField
          control={methods.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (Kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Weight in Kg"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Rate"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="">
          <Button type="submit">Calculate</Button>
        </div>
      </form>
    </Form>
  )
}
