import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input, InputPassword } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const UserFormSchema = z.object({
  id: z.uuid().nullable().optional(),
  name: z.string().min(4).max(100),
  password: z.string().min(8).or(z.literal('')),
  isActive: z.boolean(),
})

export type UserFormDataValues = z.infer<typeof UserFormSchema>

export default function UserForm({
  values,
  onSubmit,
}: {
  values?: Partial<UserFormDataValues>
  onSubmit?: (data: UserFormDataValues) => void
}) {
  const methods = useForm<UserFormDataValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      id: values?.id || null,
      name: values?.name || '',
      password: '',
      isActive: values?.isActive ?? true,
    },
  })

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => onSubmit?.(data))}
        className="space-y-4"
      >
        <FormField
          control={methods.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword
                  type="password"
                  placeholder="Enter your password"
                  {...field}
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
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  defaultChecked={true}
                />
              </FormControl>
              <FormLabel>Is Active</FormLabel>
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
