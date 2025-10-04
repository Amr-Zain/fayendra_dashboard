import { ColumnDef } from '@tanstack/react-table'
import { Filter } from '@/types/components/table'
import { countriesQueryKeys } from '@/util/queryKeysFactory'
import { createdAtColumn, imageColumn, statusColumn, textColumn } from '@/components/features/sharedColumns'
import { CountryDetails } from '@/types/api/country'
import { FieldProp } from '@/types/components/form'
import { CoutryFormData } from './Form'

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

export const fields: FieldProp<CoutryFormData>[] = [
    {
      type: 'imgUploader',
      name: 'flag',
      label: 'Flag (optional)',
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
      type: 'number',
      name: 'phone_code',
      label: 'Phone Code',
      placeholder: 'e.g. 20',
    },
    {
      type: 'number',
      name: 'phone_length',
      label: 'Phone Length',
      placeholder: 'e.g. 10',
    },
    {
      type: 'text',
      name: 'short_name',
      label: 'Short Name',
      placeholder: 'e.g. EGY',
    },
    {
      type: 'select',
      name: 'continent',
      label: 'Continent',
      inputProps: {
        placeholder: 'Select Your Continent',
        options: [
          { label: 'africa', value: 'africa' },
          { label: 'europe', value: 'europe' },
          { label: 'asia', value: 'asia' },
          { label: 'south_america', value: 'south_america' },
          { label: 'north_america', value: 'north_america' },
          { label: 'australia', value: 'australia' },
          { label: 'antarctica', value: 'antarctica' },
        ],
      },
    },

    {
      type: 'multiLangField',
      name: 'name' as any,
      label: 'Name',
      placeholder: 'Egypt',
    },
    {
      type: 'multiLangField',
      name: 'slug' as any,
      label: 'Slug',
      placeholder: 'egypt',
    },
    {
      type: 'multiLangField',
      name: 'currency' as any,
      label: 'Currency',
      placeholder: 'EGP',
    },
    {
      type: 'multiLangField',
      name: 'nationality' as any,
      label: 'Nationality',
      placeholder: 'Egyptian',
    },
  ]
