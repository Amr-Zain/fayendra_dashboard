import { ColumnDef } from '@tanstack/react-table'
import { Filter } from '@/types/components/table'
import { countriesQueryKeys } from '@/util/queryKeysFactory'
import { createdAtColumn, imageColumn, statusColumn, textColumn } from '@/components/features/sharedColumns'
import { CountryDetails } from '@/types/api/country'

export const countryColumns = (
  open: (type: 'active' | 'delete', row: CountryDetails) => void,
): ColumnDef<CountryDetails>[] => [
  imageColumn<CountryDetails>('flag',"Flag"),
  textColumn<CountryDetails>('name', 'Country Name', { sortable: false }),
  textColumn<CountryDetails>('short_name', 'Code'),
  textColumn<CountryDetails>('phone_code', 'Phone Code', {
    render: ({ getValue }) => <div className="text-muted-foreground">+{getValue()}</div>,
  }),
  textColumn<CountryDetails>('phone_length', 'Phone Length'),
  textColumn<CountryDetails>('currency', 'Currency'),
  textColumn<CountryDetails>('nationality', 'Nationality'),
  textColumn<CountryDetails>('continent', 'Continent', {
    render: ({ getValue }) => (
      <div className="text-muted-foreground capitalize">{String(getValue() ?? '')}</div>
    ),
  }),
  statusColumn<CountryDetails>(open),          
  createdAtColumn<CountryDetails>('Created'),  
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
  open: (type: 'active' | 'delete', row: CountryDetails) => void,
) => [
  {
    label: 'Edit',
    to: '/settings/countries/edit/$id',
    params: (row: CountryDetails) => ({ id: row.id.toString() }),
    queryKey: (id: string) => countriesQueryKeys.getCountry(id),
  },
  { label: 'Delete', danger: true, onClick: (row: CountryDetails) => open('delete', row) },
  { label: 'Activate/Deactivate country', onClick: (row: CountryDetails) => open('active', row) },
]
