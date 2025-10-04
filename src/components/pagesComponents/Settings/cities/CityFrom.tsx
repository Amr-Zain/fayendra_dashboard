// src/features/cities/CityForm.tsx
import z from 'zod'
import AppForm from '@/components/common/form/AppForm'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { City } from '@/types/api/country' 
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { citiesQueryKeys } from '@/util/queryKeysFactory'
import { fields } from './config'
const schema = z.object({
  //is_active: z.union([z.boolean(), z.number().int().min(0).max(1)]).optional(),
  country_id: z.coerce.string().min(1, 'Country is required'),
  map: z.object({
    lat: z.coerce.number({ message: 'Latitude is required' }),
    lng: z.coerce.number({ message: 'Longitude is required' }),
  }),
  postal_code: z
    .string()
    .min(4, 'Postal code is required min 4')
    .regex(/^\d+$/, 'Postal code must contain digits only'),
  short_cut: z.string().min(1, 'Short cut is required'),

  name_ar: z.string().min(3, 'Arabic name is required'),
  slug_ar: z.string().min(3, 'Arabic slug is required'),
  name_en: z.string().min(3, 'English name is required'),
  slug_en: z.string().min(3, 'English slug is required'),
})

export type CityFormData = z.infer<typeof schema>

export default function CityForm({ city }: { city?: City }) {
  const navigate = useNavigate()

 
  const { mutate, isPending } = useMutate({
    endpoint: city ? `cities/${city.id}` : 'cities',
    mutationKey: citiesQueryKeys.getCity(city?.id),
    mutationOptions: { meta: { invalidates: [citiesQueryKeys.all()] } },
    method: city?'put': 'post',
    onSuccess: (data: ApiResponse) => {
      toast.success(data.message)
      navigate({ to: '/settings/cities' })
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
  })

  const handleSubmit = (values: CityFormData) => {
    const payload = {
      ...values,
      lat: values.map.lat,
      lng: values.map.lng,
    }
    mutate(generateFinalOut({},payload) as any)
  }

  return (
    <AppForm<CityFormData>
      schema={schema}
      fields={fields}
      defaultValues={{
        ...generateInitialValues(city),
        map:
          city && city?.location
            ? {
                lat: Number(city.location.lat),
                lng: Number((city as any).location.lng),
              }
            : undefined,
        country_id: city?.country?.id?.toString(),
      }}
      onSubmit={handleSubmit}
      isLoading={isPending}
      gridColumns={2}
      spacing="md"
      className="bg-card border border-border rounded-lg shadow-sm"
      formClassName="p-6"
      submitButtonText={city ? 'Update City' : 'Create City'}
    />
  )
}
