'use client'
import React from 'react'

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
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const WorkerFormSchema = z.object({
  id: z.uuid().nullable().optional(),
  name: z.string().min(4).max(100),
  position: z.string().optional(),
  isActive: z.boolean(),
  hiredAt: z.date().nullable().optional(),
})

export type WorkerFormDataValues = z.infer<typeof WorkerFormSchema>

export default function WorkerForm({
  values,
  onSubmit,
}: {
  values?: Partial<WorkerFormDataValues>
  onSubmit?: (data: WorkerFormDataValues) => void
}) {
  const methods = useForm<WorkerFormDataValues>({
    resolver: zodResolver(WorkerFormSchema),
    defaultValues: {
      id: values?.id || null,
      name: values?.name || '',
      position: values?.position || '',
      isActive: values?.isActive ?? true,
      hiredAt: values?.hiredAt || null,
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
                <Input type="text" placeholder="กรอกชื่อพนักงาน" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ตำแหน่ง</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="กรอกตำแหน่งพนักงาน"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="hiredAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วันที่จ้าง</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="เลือกวันที่จ้าง"
                  {...field}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : null,
                    )
                  }
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
              <FormLabel>ใช้งานอยู่</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">ส่งข้อมูล</Button>
        </div>
      </form>
    </Form>
  )
}
