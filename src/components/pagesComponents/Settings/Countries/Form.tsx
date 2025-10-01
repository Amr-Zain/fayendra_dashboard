import z from 'zod'
import { Control } from 'react-hook-form'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'

export type Country = {
  id?: number
  is_active?: boolean | number
  phone_code: number
  phone_length: number
  short_name: string
  continent:
    | 'africa'
    | 'europe'
    | 'asia'
    | 'south_america'
    | 'north_america'
    | 'australia'
    | 'antarctica'
  flag?: string | null

  // فقط EN و AR
  name_en?: string
  slug_en?: string
  currency_en?: string
  nationality_en?: string
  name_ar?: string
  slug_ar?: string
  currency_ar?: string
  nationality_ar?: string
}

// Schema: الأساسيات + EN/AR Required
const schema = z.object({
  is_active: z.union([z.boolean(), z.number().int().min(0).max(1)]).optional(),
  phone_code: z.coerce.number({ message: 'Required => numeric value' }),
  phone_length: z.coerce.number({ message: 'Required => numeric value' }),
  short_name: z.string().min(2, 'Required => string value').max(5),
  continent: z.enum(
    [
      'africa',
      'europe',
      'asia',
      'south_america',
      'north_america',
      'australia',
      'antarctica',
    ],
    { required_error: 'Required' },
  ),

  // EN (Required)
  name_en: z.string().min(1, 'Required'),
  slug_en: z.string().min(1, 'Required'),
  currency_en: z.string().min(1, 'Required'),
  nationality_en: z.string().min(1, 'Required'),

  // AR (Required)
  name_ar: z.string().min(1, 'Required'),
  slug_ar: z.string().min(1, 'Required'),
  currency_ar: z.string().min(1, 'Required'),
  nationality_ar: z.string().min(1, 'Required'),

  // صورة العلم اختياري
  flag: z.any().optional(),
})

type FormData = z.infer<typeof schema>

export default function CountryForm({ country }: { country?: Country }) {
  const navigate = useNavigate()

  const fields: FieldProp<FormData>[] = [
    {
      type: 'number',
      name: 'phone_code',
      label: 'Phone Code',
      placeholder: 'e.g. 20',
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'number',
      name: 'phone_length',
      label: 'Phone Length',
      placeholder: 'e.g. 10',
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'text',
      name: 'short_name',
      label: 'Short Name',
      placeholder: 'e.g. EGY',
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'select',
      name: 'continent',
      label: 'Continent',
      span: 1,
      control: {} as Control<FormData>,
      options: [
        { label: 'africa', value: 'africa' },
        { label: 'europe', value: 'europe' },
        { label: 'asia', value: 'asia' },
        { label: 'south_america', value: 'south_america' },
        { label: 'north_america', value: 'north_america' },
        { label: 'australia', value: 'australia' },
        { label: 'antarctica', value: 'antarctica' },
      ],
    },

    // —— MultiLang: EN + AR فقط ——
    {
      type: 'multiLangField',
      name: 'name' as any,
      label: 'Name',
      placeholder: 'Egypt',
      span: 1,
      control: {} as Control<FormData>,
      inputProps: {
        labeling: { en: 'Name (EN)', ar: 'الاسم (AR)' },
      },
    },
    {
      type: 'multiLangField',
      name: 'slug' as any,
      label: 'Slug',
      placeholder: 'egypt',
      span: 1,
      control: {} as Control<FormData>,
      inputProps: {
        labeling: { en: 'Slug (EN)', ar: 'Slug (AR)' },
      },
    },
    {
      type: 'multiLangField',
      name: 'currency' as any,
      label: 'Currency',
      placeholder: 'EGP',
      span: 1,
      control: {} as Control<FormData>,
      inputProps: {
        labeling: { en: 'Currency (EN)', ar: 'العملة (AR)' },
      },
    },
    {
      type: 'multiLangField',
      name: 'nationality' as any,
      label: 'Nationality',
      placeholder: 'Egyptian',
      span: 1,
      control: {} as Control<FormData>,
      inputProps: {
        labeling: { en: 'Nationality (EN)', ar: 'الجنسية (AR)' },
      },
    },

    {
      type: 'imgUploader',
      name: 'flag' as any,
      label: 'Flag (optional)',
      span: 1,
      control: {} as Control<FormData>,
      inputProps: {
        maxFiles: 1,
        acceptedFileTypes: ['image/*'],
        apiEndpoint: 'upload-media',
        model: 'country_flag',
        shapeType: 'picture-card',
      },
    },

    {
      type: 'checkbox',
      name: 'is_active',
      label: 'Active',
      span: 1,
      control: {} as Control<FormData>,
    },
  ]

  const { mutate, isPending } = useMutate({
    endpoint: country?.id ? `countries/${country.id}` : 'countries',
    mutationKey: ['country', country?.id],
    mutationOptions: { meta: { invalidates: [['countries', 'list']] } },
    method: country?.id ? 'put' : 'post',
    onSuccess: (data: ApiResponse) => {
      toast.success(data.message)
      navigate({ to: '/settings/countries' })
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
  })

  const handleSubmit = (values: FormData) => {
    const payload = {
      ...values,
      is_active:
        typeof values.is_active === 'boolean'
          ? values.is_active
            ? 1
            : 0
          : values.is_active,
    }
    mutate(generateFinalOut({}, payload) as any)
  }

  return (
    <AppForm<FormData>
      schema={schema}
      fields={fields}
      defaultValues={{
        ...generateInitialValues(country),
        is_active:
          typeof country?.is_active !== 'undefined'
            ? !!Number(country?.is_active)
            : true,
      }}
      onSubmit={handleSubmit}
      isLoading={isPending}
      gridColumns={2}
      spacing="md"
      className="bg-card border border-border rounded-lg shadow-sm"
      formClassName="p-6"
      submitButtonText={country?.id ? 'Update Country' : 'Create Country'}
    />
  )
}
