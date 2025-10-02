import { Control, FieldValues } from 'react-hook-form'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LogIn } from 'lucide-react'
import AppForm from '../../common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { useMutate } from '@/hooks/UseMutate'
import { useAuthStore, User } from '@/stores/authStore'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { ApiResponse } from '@/types/api/http'
import { Logo } from '@/components/common/Icons'

const loginSchema = z.object({
  login: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const { mutate, isPending } = useMutate<ApiResponse<User>>({
    endpoint: 'auth/login',
    mutationKey: ['login'],
    onSuccess: (data) => {
      setUser(data?.data)
      toast.success(data.message)
      navigate({ to: '/', replace: true })
    },
    onError: (_err, normalized) => {
      console.log(normalized)
      toast.error(normalized.message)
    },
  })
  const fields: FieldProp<LoginFormValues>[] = [
    {
      type: 'email',
      name: 'login',
      label: 'Email Address',
      placeholder: 'your.email@example.com',
      span: 2,
      control: {} as Control<LoginFormValues>,
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      placeholder: 'Enter a secure password',
      span: 2,
      control: {} as Control<LoginFormValues>,
    },
  ]

  const onSubmit = async (values: LoginFormValues) => {
    // Simulate login
    console.log('Login values:', values)
    // For demo, just navigate to dashboard
    mutate(values)
  }

  return (
    <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Logo />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AppForm<LoginFormValues>
          schema={loginSchema}
          fields={fields}
          onSubmit={onSubmit}
          isLoading={isPending}
          gridColumns={1}
          spacing="lg"
          className="bg-card border border-border rounded-lg shadow-sm"
          formClassName="p-6"
        />
      </CardContent>
    </Card>
  )
}
