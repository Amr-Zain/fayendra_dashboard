import { ColumnDef } from '@tanstack/react-table'
import { City, Country } from '@/types/api/country'
import { hasPermission } from '@/util/helpers'
import { Filter } from '@/types/components/table'
import { citiesQueryKeys } from '@/util/queryKeysFactory'
import { createdAtColumn, statusColumn, textColumn } from '@/components/features/sharedColumns'



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
