// src/features/cities/CityForm.tsx
import z from 'zod'
import { Control } from 'react-hook-form'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { City, Country } from '@/types/api/country' // assuming Country exists alongside City
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { citiesQueryKeys } from '@/util/queryKeysFactory'
const schema = z.object({
  is_active: z.union([z.boolean(), z.number().int().min(0).max(1)]).optional(),
  country_id: z.coerce.string().min(1, 'Country is required'),
  map: z.object({
    lat: z.coerce.number({ message: 'Latitude is required' }),
    lng: z.coerce.number({ message: 'Longitude is required' }),
  }),
  //location: z.string().min(1, 'Location is required'),
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

type FormData = z.infer<typeof schema>

export default function CityForm({ city }: { city?: City }) {
  const navigate = useNavigate()

  const fields: FieldProp<FormData>[] = [
    {
      type: 'select',
      name: 'country_id',
      label: 'Country',
      inputProps: {
        endpoint: 'countries',
        select: (data) =>
          (data.data as unknown as Country[]).map((c) => ({
            label: c.name,
            value: String(c.id),
          })),
        placeholder: 'Select country',
      },
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'text',
      name: 'postal_code',
      label: 'Postal Code',
      placeholder: 'e.g. 5477',
      span: 1,
      control: {} as Control<FormData>,
    },

    {
      type: 'multiLangField',
      name: 'name' as any,
      label: 'English Name',
      placeholder: 'Mansoura',
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'multiLangField',
      name: 'slug',
      label: 'English Slug',
      placeholder: 'mansoura',
      span: 1,
      control: {} as Control<FormData>,
    },
    {
      type: 'map',
      name: 'map',
      label: 'Map',
      placeholder: 'e.g. 30.0444',
      span: 2,
      control: {} as Control<FormData>,
    },
    {
        type: 'text',
        name: 'short_cut',
        label: 'Short Code',
        placeholder: 'e.g. mans',
        span: 1,
        control: {} as Control<FormData>,
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

  const handleSubmit = (values: FormData) => {
    const payload = {
      ...values,
      is_active:
        typeof values.is_active === 'boolean'
          ? values.is_active
            ? 1
            : 0
          : values.is_active,
        lat: values.map.lat,
        lng: values.map.lng,
    }
    mutate(generateFinalOut({},payload) as any)
  }

  return (
    <AppForm<FormData>
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
