'use client'

import { GalleryVerticalEnd } from 'lucide-react'

import { cn } from '@/lib/utils/index'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input, InputPassword } from '@/components/ui/input'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'
import { useCallback } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const SignInFormSchema = z.object({
  name: z.string().min(4, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
})

type SignInFormData = z.infer<typeof SignInFormSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const methods = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  const onSubmit = useCallback(
    async (data: SignInFormData) => {
      const result = await signIn('credentials', {
        redirect: false,
        name: data.name,
        password: data.password,
      })
      if (!result?.error) {
        toast.success('เข้าสู่ระบบสำเร็จ!')
        router.refresh()
        return
      }
      toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    },
    [router],
  )

  return (
    <Form {...methods}>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <Link
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Mini Contract</span>
              </Link>
              <h1 className="text-xl font-bold">Welcome to Mini Contract</h1>
            </div>
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อผู้ใช้</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="กรอกชื่อผู้ใช้" />
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
                      {...field}
                      placeholder="กรอกรหัสผ่าน"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Field>
              <Button type="submit">เข้าสู่ระบบ</Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </Form>
  )
}
