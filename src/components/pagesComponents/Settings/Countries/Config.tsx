import { ColumnHeader } from '@/components/common/table/ColumnHeader'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Filter } from '@/types/components/table'
import { Switch } from '@/components/ui/switch'
import { Dispatch, SetStateAction } from 'react'
import { hasPermission } from '@/util/helpers'
import { countriesQueryKeys } from '@/util/queryKeysFactory'
import { createdAtColumn, imageColumn, statusColumn, textColumn } from '@/components/features/sharedColumns'

export type Country = {
  id: number
  name: string
  slug: string
  short_name: string
  phone_code: number
  phone_length: number
  currency: string
  nationality: string
  flag: string | null
  continent:
    | 'africa'
    | 'asia'
    | 'europe'
    | 'north-america'
    | 'south-america'
    | 'australia'
    | 'antarctica'
    | string
  is_active: boolean
  created_at: string
}



const columnHelper = createColumnHelper<Country>()

export const countryColumns = (
  open: (type: 'active' | 'delete', row: Country) => void,
): ColumnDef<Country>[] => [
  imageColumn<Country>('flag',"Flag"),
  textColumn<Country>('name', 'Country Name', { sortable: false }),
  textColumn<Country>('short_name', 'Code'),
  textColumn<Country>('phone_code', 'Phone Code', {
    render: ({ getValue }) => <div className="text-muted-foreground">+{getValue()}</div>,
  }),
  textColumn<Country>('phone_length', 'Phone Length'),
  textColumn<Country>('currency', 'Currency'),
  textColumn<Country>('nationality', 'Nationality'),
  textColumn<Country>('continent', 'Continent', {
    render: ({ getValue }) => (
      <div className="text-muted-foreground capitalize">{String(getValue() ?? '')}</div>
    ),
  }),
  statusColumn<Country>(open),          
  createdAtColumn<Country>('Created'),  
]

export const countryFilters: Filter[] = [
  { id: 'is_active', title: 'Status', options: [
      { label: 'Active', value: '1' },
      { label: 'Inactive', value: '0' },
    ], multiple: false },
  { id: 'sort', title: 'Sort', options: [
      { label: 'ASC', value: 'asc' },
      { label: 'DESC', value: 'desc' },
    ], multiple: false },
]

export const actions = (
  open: (type: 'active' | 'delete', row: Country) => void,
) => [
  {
    label: 'Edit',
    to: '/settings/countries/edit/$id',
    params: (row: Country) => ({ id: row.id.toString() }),
    queryKey: (id: string) => countriesQueryKeys.getCountry(id),
  },
  { label: 'Delete', danger: true, onClick: (row: Country) => open('delete', row) },
  { label: 'Activate/Deactivate country', onClick: (row: Country) => open('active', row) },
]
