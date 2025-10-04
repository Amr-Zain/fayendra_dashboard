import { ColumnDef } from '@tanstack/react-table'
import { pagesQueryKeys } from '@/util/queryKeysFactory'
import { createdAtColumn, imageColumn, statusColumn, textColumn } from '@/components/features/sharedColumns'
import { FieldProp } from '@/types/components/form'
import { StaticPageFormData } from './Form'

export type StaticPage = {
  id: number
  type: string
  title: string
  image: string | null
  content: string
  is_active: boolean
  created_at: string
}

export const staticPagesColumns = (
  open: (type: 'active' | 'delete', id: StaticPage) => void,
): ColumnDef<StaticPage>[] =>
  [
    imageColumn<StaticPage>('image',"Image"),
    textColumn<StaticPage>('title', 'Title'),
    textColumn<StaticPage>('type', 'Type'),
    statusColumn<StaticPage>(open, 'Status' ),
    createdAtColumn<StaticPage>( 'created' ),
  ] as ColumnDef<StaticPage>[]

export const actions =  (
  open: (type: 'active' | 'delete', row: StaticPage) => void,
) =>  [
 {
    label: 'Edit',
    to: '/static-pages/edit/$id',
    params: (row: StaticPage) => ({ id: row.id.toString() }),
    queryKey: (id: string) => pagesQueryKeys.getPage(id),
  },
  {
    label: 'Delete',
    danger: true,
  onClick: (row: StaticPage) => open('delete', row),
  },
  {
    label: 'Activate/Deactivate',
    onClick: (row: StaticPage) => open('active', row),
  },
]

export const fields: FieldProp<StaticPageFormData>[] = [
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
  
  ]
