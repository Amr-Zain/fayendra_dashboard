import z from 'zod'
import { useTranslation } from 'react-i18next'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { Control } from 'react-hook-form'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponse } from '@/types/api/http'
import { toast } from 'sonner'

const schema = z
  .object({
    current_password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((v) => v.password === v.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Passwords do not match',
  })

type FormData = z.infer<typeof schema>

export default function ChangePasswordForm() {
  const { t } = useTranslation()

  const fields: FieldProp<FormData>[] = [
    {
      type: 'password',
      name: 'current_password',
      label: t('form.currentPasswordLabel'),
      placeholder: t('form.passwordPlaceholder'),
      span: 2,
    },
    {
      type: 'password',
      name: 'password',
      label: t('form.newPasswordLabel'),
      placeholder: t('form.newPasswordPlaceholder'),
    },
    {
      type: 'password',
      name: 'password_confirmation',
      label: t('form.confirmPasswordLabel'),
      placeholder: t('form.confirmPasswordPlaceholder'),
    },
  ]

  const { mutate, isPending } = useMutate<ApiResponse, any>({
    mutationKey: ['profile/change-password'],
    endpoint: 'profile/change-password',
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
    method: 'post',
  })

  const handleSubmit = (values: FormData) => {
    mutate(values)
  }

  return (
    <AppForm<FormData>
      schema={schema}
      fields={fields}
      defaultValues={{
        current_password: '',
        password: '',
        password_confirmation: '',
      }}
      onSubmit={handleSubmit}
      isLoading={isPending}
      gridColumns={2}
      spacing="md"
      className="bg-card border border-border rounded-lg shadow-sm"
      formClassName="p-6"
      submitButtonText={t('buttons.confirm')}
    />
  )
}
