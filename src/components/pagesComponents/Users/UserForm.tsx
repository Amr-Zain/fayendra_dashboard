import { User } from '@/types/api/user'
import { useTranslation } from 'react-i18next'
import AppForm from '@/components/common/form/AppForm'
import z from 'zod'
import { FieldProp } from '@/types/components/form'
import { Control } from 'react-hook-form'
import { generateInitialValues } from '@/util/helpers'
import { City } from '@/types/api/country'
import { useMutate } from '@/hooks/UseMutate'
import { usersQueryKeys } from '@/util/queryKeysFactory'
import { ApiResponse } from '@/types/api/http'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
const schema = z.object({
  image: z.string().min(10, 'required'),
  full_name: z.string().min(4, 'First name must be at least 2 characters'),

  email: z.string().email('Please enter a valid email'),

  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender',
  }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z
    .string()
    .min(8, 'Password must be at least 8 characters'),

  phone_code: z.string().min(1, 'Please select country code'),
  phone: z.string().min(8, 'Phone number is too short'),

  city_id: z.string().min(1, 'Please select a country'),
})
type FormData = z.infer<typeof schema>

export default function UserForm({ user }: { user?: User }) {
  const { t } = useTranslation()
  const fields: FieldProp<FormData>[] = [
    {
      type: 'imgUploader',
      label: t('labels.image'),
      name: 'image',
      inputProps: {
        model: 'users',
        baseUrl: import.meta.env.VITE_BASE_GENERAL_URL,
        maxCount: 1,
      },
      span: 2,
      control: {} as Control<FormData>,
    },
    {
      type: 'text',
      name: 'full_name',
      label: 'First Name',
      placeholder: 'Enter your first name',
      span: 1,
      control: {} as Control<FormData>,
    },

    {
      type: 'email',
      name: 'email',
      label: 'Email Address',
      placeholder: 'your.email@example.com',
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      placeholder: 'Enter a secure password',
      span: 1,
      control: {} as Control<FormData>,
    },

    {
      type: 'password',
      name: 'password_confirmation',
      label: 'Password',
      placeholder: 'Enter a secure password',
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'phone',
      name: 'phone',
      label: 'Phone Number',
      inputProps: {
        phoneCodeName: 'phone_code',
        phoneNumberName: 'phone',
        currentPhoneLimit: 10,
      },
      span: 2,
      control: {} as Control<FormData>,
    },
    {
      type: 'select',
      name: 'gender',
      label: 'gender',
      inputProps: {
        options: [
          { label: 'Female', value: 'female' },
          { label: 'Male', value: 'male' },
        ],
        placeholder: 'Enter your gender',
      },
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'select',
      name: 'city_id',
      label: 'gender',
      inputProps: {
        endpoint: 'cities_without_pagination',
        select: (data) => {
          return (data.data as City[]).map((city) => ({
            label: city.name,
            value: city.id,
          }))
        },
        placeholder: 'Enter your city',
      },
      span: 1,
      control: {} as Control<FormData>,
    },
  ]
  const navigate = useNavigate()

  const { mutate, isPending } = useMutate({
    endpoint: user ? `users/${user.id}` : 'users',
    mutationKey: usersQueryKeys.all(),
    mutationOptions: {
      meta: { invalidates: [usersQueryKeys.all()] },
    },
    onSuccess: (data: ApiResponse) => {
      toast.success(data.message)
      navigate({ to: '/users' })
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
  })
  const handleSubmit = (values: FormData) => {
    console.log(values)
    mutate({ ...values, user_type: 'client' })
  }
  return (
    <AppForm<FormData>
      schema={schema}
      fields={fields}
      defaultValues={generateInitialValues(user)}
      onSubmit={handleSubmit}
      isLoading={isPending}
      gridColumns={2}
      spacing="md"
      className="bg-card border border-border rounded-lg shadow-sm"
      formClassName="p-6"
    />
  )
}
