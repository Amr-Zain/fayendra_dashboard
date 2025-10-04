import z from 'zod'
import { useTranslation } from 'react-i18next'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponse } from '@/types/api/http'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'

const schema = z.object({
  allow_notifications: z.boolean(),
  locale: z.enum(['ar', 'en']),
})

type FormData = z.infer<typeof schema>

export default function ProfileSettings() {
    const { t } = useTranslation()
    const settings = useAuthStore((state) => state.user?.settings)
    const updateUser = useAuthStore((state) => state.updateUser)
    const fields: FieldProp<FormData>[] = [
    {
      type: 'checkbox',
      name: 'allow_notifications',
      label: t('form.allow_notifications'),
      span: 2,
    },
    {
      type: 'select',
      name: 'locale',
      inputProps: {
        placeholder: 'prefered language',
        options: [
          { label: 'Arabic', value: 'ar' },
          { label: 'English', value: 'en' },
        ],
      },
      label: t('form.newPasswordLabel'),
      placeholder: t('form.newPasswordPlaceholder'),
    },
  ]
  

  const { mutateAsync, isPending } = useMutate<ApiResponse, any>({
    mutationKey: ['rofile/settings'],
    endpoint: 'profile/settings',
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
    method: 'put',
  })

  const handleSubmit = async (values: FormData) => {
    await mutateAsync(values)
    updateUser({
      settings: {
        laguage: values.locale,
        allow_notifications: values.allow_notifications,
      },
    })
  }

  return (
    <AppForm<FormData>
      schema={schema}
      fields={fields}
      defaultValues={{
        allow_notifications: settings?.allow_notifications,
        locale: settings?.language,
      }}
      onSubmit={handleSubmit}
      isLoading={isPending}
      gridColumns={2}
      spacing="md"
      className="bg-card border border-border rounded-lg shadow-sm"
      formClassName="p-6"
      submitButtonText={t('buttons.edit')}
    />
  )
}
