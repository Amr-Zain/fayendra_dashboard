import z from 'zod'
import AppForm from '@/components/common/form/AppForm'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { countriesQueryKeys } from '@/util/queryKeysFactory'
import { CountryDetails } from '@/types/api/country'
import { fields } from './Config'


const schema = z.object({
  //is_active: z.union([z.boolean(), z.number().int().min(0).max(1)]).optional(),
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

  name_en: z.string().min(1, 'Required'),
  slug_en: z.string().min(1, 'Required'),
  currency_en: z.string().min(1, 'Required'),
  nationality_en: z.string().min(1, 'Required'),

  name_ar: z.string().min(1, 'Required'),
  slug_ar: z.string().min(1, 'Required'),
  currency_ar: z.string().min(1, 'Required'),
  nationality_ar: z.string().min(1, 'Required'),

  flag: z.string(),
})

export type CoutryFormData = z.infer<typeof schema>

export default function CountryForm({ country }: { country?: CountryDetails }) {
  const navigate = useNavigate()

  const { mutate, isPending } = useMutate({
    endpoint: country?.id ? `countries/${country.id}` : 'countries',
    mutationKey: ['country', country?.id],
    mutationOptions: { meta: { invalidates: [countriesQueryKeys.all()] } },
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

  const handleSubmit = (values: CoutryFormData) => {
    mutate(generateFinalOut({}, values) as any)
  }

  return (
    <AppForm<CoutryFormData>
      schema={schema}
      fields={fields}
      defaultValues={generateInitialValues(country)}
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
