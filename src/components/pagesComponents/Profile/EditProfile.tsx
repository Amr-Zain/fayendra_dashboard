import z from 'zod'
import { useTranslation } from 'react-i18next'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { Control } from 'react-hook-form'
import { generateInitialValues } from '@/util/helpers'
import { useMutate } from '@/hooks/UseMutate'
import { ApiResponse } from '@/types/api/http'
import { toast } from 'sonner'
import { City } from '@/types/api/country'
import { useAuthStore, User } from '@/stores/authStore'

const schema = z.object({
  image: z.string().min(1, 'required').optional(),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone_code: z.string().min(1, 'Please select country code'),
  phone: z.string().min(6, 'Phone number is too short'),
  email: z.string().email('Please enter a valid email'),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender',
  }),
  city_id: z.string().min(1, 'Please select a city'),
})

type FormData = z.infer<typeof schema>

export default function EditProfileForm({
  initialValues,
}: {
  initialValues: any
}) {
  const { t } = useTranslation()

  const fields: FieldProp<FormData>[] = [
   /*  {
      type: 'imgUploader',
      label: t('form.uploadImageText'),
      name: 'image',
      inputProps: {
        model: 'users',
        baseUrl: import.meta.env.VITE_BASE_GENERAL_URL,
        maxCount: 1,
        showPreview:true,

      },
      
      span: 2,
      control: {} as Control<FormData>,
    }, */
    {
      type: 'text',
      name: 'full_name',
      label: t('form.name'),
      placeholder: t('form.namePlaceholder'),
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'email',
      name: 'email',
      label: t('form.email'),
      placeholder: t('form.emailPlaceholder'),
      span: 1,
      control: {} as Control<FormData>,
    },

    {
      type: 'select',
      name: 'gender',
      label: t('labels.gender'),
      inputProps: {
        options: [
          { value: 'male', label: t('labels.male') },
          { value: 'female', label: t('labels.female') },
        ],
        placeholder: t('form.brandPlaceholder'),
      },
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'select',
      name: 'city_id',
      label: t('labels.city'),
      inputProps: {
        endpoint: 'cities_without_pagination',
        select: (data) =>
          (data.data as City[]).map((city) => ({
            label: city.name,
            value: city.id,
          })),
        placeholder: t('form.cityPlaceholder'),
      },
      span: 1,
      control: {} as Control<FormData>,
    },
   /*  {
      type: 'phone',
      name: 'phone',
      label: t('form.phone'),
      inputProps: {
        phoneCodeName: 'phone_code',
        phoneNumberName: 'phone',
        currentPhoneLimit: 15,
      },
      span: 2,
      control: {} as Control<FormData>,
    }, */
  ]
  const setUser = useAuthStore(state=>state.setUser)
  const { mutate, isPending } = useMutate<ApiResponse<User>, any>({
    mutationKey: ['profile/update'],
    endpoint: 'profile/update',
    onSuccess: (data) => {
      setUser(data.data)
      toast.success(data.message)
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
    method: 'post',
  })

  const handleSubmit = (values: FormData) => {
    const payload = {
      ...values,
      _method: 'put',
    }
    mutate(payload)
  }

  return (
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
  )
}
