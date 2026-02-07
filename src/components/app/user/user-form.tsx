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
  name: z.string().min(4, 'ต้องมีความยาวอย่างน้อย 4 ตัวอักษร').max(100, 'ต้องมีความยาวไม่เกิน 100 ตัวอักษร'),
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
              <FormLabel>ชื่อ</FormLabel>
              <FormControl>
                <Input type="text" placeholder="กรุณาใส่ชื่อของคุณ" {...field} />
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
              <FormLabel>รหัสผ่าน</FormLabel>
              <FormControl>
                <InputPassword
                  type="password"
                  placeholder="กรุณาใส่รหัสผ่านของคุณ"
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
              <FormLabel>อนุญาตใช้งาน</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">ส่งข้อมูล</Button>
        </div>
      </form>
    </Form>
  )
}
