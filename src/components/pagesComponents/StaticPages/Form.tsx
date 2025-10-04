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

type FormData = z.infer<typeof schema>

export default function PageForm({ page }: { page?: any }) {
  const navigate = useNavigate()

  const fields: FieldProp<FormData>[] = [
    {
      type: 'imgUploader',
      name: 'image',
      label: 'image',
      span: 2,
      inputProps: {
        maxFiles: 1,
        acceptedFileTypes: ['image/*'],
        apiEndpoint: '/media/upload',
        model: 'image',
        baseUrl: import.meta.env.VITE_BASE_URL_API,
      },
    },
    ,
    {
      type: 'select',
      name: 'type',
      label: 'Page Type',
      inputProps: {
        placeholder: 'Select Page Type',
        options: [
          { label: 'about_us', value: 'about_us' },
          { label: 'privacy_policy', value: 'privacy_policy' },
          { label: 'warranty_policy', value: 'warranty_policy' },
          { label: 'return_policy', value: 'return_policy' },
          { label: 'shipping_policy', value: 'shipping_policy' },
        ],
      },
    },

    {
      type: 'multiLangField',
      name: 'title' as any,
      label: 'Name',
      placeholder: 'Egypt',
    },
    {
      type: 'multiLangField',
      name: 'content' as any,
      label: 'content',
      placeholder: 'egypt',
      inputProps: {
        type: 'editor',
      },
    },
   /*  {
      type: 'checkbox',
      name: 'is_active',
      label: 'Active',
    }, */
  ]

  const { mutate, isPending } = useMutate({
    endpoint: page?.id ? `static-pages/${page.id}` : 'static-pages',
    mutationKey: pagesQueryKeys.getPage(),
    mutationOptions: { meta: { invalidates: [pagesQueryKeys.all()] } },
    method: page?.id ? 'put' : 'post',
    onSuccess: (data: ApiResponse) => {
      toast.success(data.message)
      navigate({ to: '/pages' })
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
    formData: true,
  })

  const handleSubmit = (values: FormData) => {
 
    mutate(generateFinalOut({}, values))
  }

  return (
    <AppForm<FormData>
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
