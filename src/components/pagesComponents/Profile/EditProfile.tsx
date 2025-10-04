import z from 'zod'
import { useTranslation } from 'react-i18next'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { Control } from 'react-hook-form'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponseBase } from '@/types/api/http'
import { toast } from 'sonner'
import { useAuthStore, UserAuth } from '@/stores/authStore'

const schema = z.object({
  image: z.string().min(1, 'required').optional(),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone_code: z.string().min(1, 'Please select country code'),
  phone: z.string().min(6, 'Phone number is too short'),
  email: z.string().email('Please enter a valid email'),
})

type FormData = z.infer<typeof schema>

export default function EditProfileForm({
  initialValues,
}: {
  initialValues: any
}) {
  const { t } = useTranslation()

  const fields: FieldProp<FormData>[] = [
    {
      type: 'imgUploader',
      name: 'image',
      label: 'Profle Image',
      span: 2,
      inputProps: {
        maxFiles: 1,
        acceptedFileTypes: ['image/*'],
        apiEndpoint: '/media/upload',
        model: 'image',
        baseUrl: import.meta.env.VITE_BASE_URL_API,
        
      },
    },
    {
      type: 'text',
      name: 'full_name',
      label: t('form.name'),
      placeholder: t('form.namePlaceholder'),
    },
    {
      type: 'email',
      name: 'email',
      label: t('form.email'),
      placeholder: t('form.emailPlaceholder'),
    },
  
    {
      type: 'phone',
      name: 'phone',
      label: t('form.phone'),
      inputProps: {
        phoneCodeName: 'phone_code',
        phoneNumberName: 'phone',
      },
      span: 2,
    },
  ]
  const setUser = useAuthStore(state=>state.setUser)
  const { mutate, isPending } = useMutate<ApiResponseBase<UserAuth>>({
    mutationKey: ['profile'],
    endpoint: 'profile',
    onSuccess: (data) => {
      setUser(data.data)
      toast.success(data.message)
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
    method: 'put',
  })

  const handleSubmit = (values: FormData) => {
    const payload = {
      ...values,
      _method: 'put',
    }
    mutate(payload)
  }

  return (
    <div>
      <AppForm<FormData>
        schema={schema}
        fields={fields}
        defaultValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isPending}
        gridColumns={2}
        spacing="md"
        className="bg-card border border-border rounded-lg shadow-sm"
        formClassName="p-6"
        submitButtonText={t('buttons.edit')}
        key={`form_${initialValues?.id ?? 'profile'}`}
      />

    </div>
  )
}
