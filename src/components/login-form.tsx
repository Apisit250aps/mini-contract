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
  name: z.string().min(4, 'Name must be at least 4 characters long'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
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
        toast.success('Logged in successfully!')
        router.refresh()
        return
      }
      toast.error('Invalid username or password')
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
                <span className="sr-only">Acme Inc.</span>
              </Link>
              <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
            </div>
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your username" />
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
                      {...field}
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Field>
              <Button type="submit">Login</Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </Form>
  )
}
