import { ColumnDef } from '@tanstack/react-table'
import { City, Country } from '@/types/api/country'
import { hasPermission } from '@/util/helpers'
import { Filter } from '@/types/components/table'
import { citiesQueryKeys } from '@/util/queryKeysFactory'
import { createdAtColumn, statusColumn, textColumn } from '@/components/features/sharedColumns'
import { FieldProp } from '@/types/components/form'
import { CityFormData } from './CityFrom'



export const cityColumns = (
  open: (type: 'active' | 'delete', row: City) => void,
): ColumnDef<City>[] => [
  textColumn<City>('name', 'Name', {
    render: ({ row }) => row.original.name ,
  }),
  textColumn<City>('short_cut', 'Short Code'),
  textColumn<City>('postal_code', 'Postal Code'),
  statusColumn<City>(open),
  createdAtColumn<City>(),
]

export const actions =( 
  open: (type: 'active' | 'delete', row: City) => void,
) => [
  {
    label: 'Edit city',
    to: '/settings/cities/edit/$id',
    params: (row: City) => ({ id: row.id.toString() }),
    disabled: hasPermission('cities.edit'),
    queryKey: (id:string)=>citiesQueryKeys.getCity(id)
  },
  {
  label: 'Delete',
  danger: true,
  onClick: (row: City) => open('delete', row),
},
{
  label: 'Activate/Deactivate',
  onClick: (row: City) => open('active', row),
},
]

export const filters: Filter[] = [
  {
    id: 'is_active',
    title: 'Status',
    options: [
      { label: 'Active', value: '1' },
      { label: 'Inactive', value: '0' },
    ],
    multiple: false,
  },
  {
    id: 'sort',
    title: 'Sort',
    options: [
      { label: 'ASC', value: 'asc' },
      { label: 'DESC', value: 'desc' },
    ],
    multiple: false,
},
{
    id: 'country_id',
    title: 'Country',
    endpoint: 'countries',
    select: (data) =>
        (data.data as unknown as Country[]).map((c) => ({
            label: c.name,
            value: String(c.id),
        })),
    multiple: false,
    },
]
export const fields: FieldProp<CityFormData>[] = [
    {
      type: 'select',
      name: 'country_id',
      label: 'Country',
      inputProps: {
        endpoint: 'countries',
        select: (data) =>
          (data.data as unknown as City[]).map((c) => ({
            label: c.name,
            value: String(c.id),
          })),
        placeholder: 'Select country',
      },
      span: 1,
    },
    {
      type: 'text',
      name: 'postal_code',
      label: 'Postal Code',
      placeholder: 'e.g. 5477',
    },

    {
      type: 'multiLangField',
      name: 'name' as any,
      label: 'English Name',
      placeholder: 'Mansoura',
    },
    {
      type: 'multiLangField',
      name: 'slug',
      label: 'English Slug',
      placeholder: 'mansoura',
    },
    {
      type: 'text',
      name: 'short_cut',
      label: 'Short Code',
      placeholder: 'e.g. mans',
    },
    {
      type: 'map',
      name: 'map',
      label: 'Map',
      placeholder: 'e.g. 30.0444',
      span:2
    },
  ]
