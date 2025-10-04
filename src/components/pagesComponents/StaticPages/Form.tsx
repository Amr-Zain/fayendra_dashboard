import z from 'zod'
import { Control } from 'react-hook-form'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { useMutate } from '@/hooks/UseMutate'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useNavigate } from '@tanstack/react-router'
import { generateFinalOut, generateInitialValues } from '@/util/helpers'
import { pagesQueryKeys } from '@/util/queryKeysFactory'
import { fields } from './Config'

const schema = z.object({
  image: z.string(),
  type: z.enum(
    [
      'about_us',
      'privacy_policy',
      'warranty_policy',
      'return_policy',
      'shipping_policy',
    ],
    { required_error: 'Required' },
  ),

  // EN (Required)
  title_en: z.string().min(1, 'Required'),
  content_en: z.string().min(1, 'Required'),
  
  // AR (Required)
  title_ar: z.string().min(1, 'Required'),
  content_ar: z.string().min(1, 'Required'),
  //is_active: z.union([z.boolean(), z.number().int().min(0).max(1)]).optional(),
})

export type StaticPageFormData = z.infer<typeof schema>

export default function PageForm({ page }: { page?: any }) {
  const navigate = useNavigate()

  const { mutate, isPending } = useMutate({
    endpoint: page?.id ? `static-pages/${page.id}` : 'static-pages',
    mutationKey: pagesQueryKeys.getPage(),
    mutationOptions: { meta: { invalidates: [pagesQueryKeys.all()] } },
    method: page?.id ? 'put' : 'post',
    onSuccess: (data: ApiResponse) => {
      toast.success(data.message)
      navigate({ to: '/static-pages' })
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
  })

  const handleSubmit = (values: StaticPageFormData) => {
    mutate(generateFinalOut({}, values))
  }

  return (
    <AppForm<StaticPageFormData>
      schema={schema}
      fields={fields}
      defaultValues={{
        ...generateInitialValues(page),
      }}
      onSubmit={handleSubmit}
      isLoading={isPending}
      gridColumns={2}
      spacing="md"
      className="bg-card border border-border rounded-lg shadow-sm"
      formClassName="p-6"
      submitButtonText={page?.id ? 'Update Page' : 'Create Page'}
    />
  )
}
