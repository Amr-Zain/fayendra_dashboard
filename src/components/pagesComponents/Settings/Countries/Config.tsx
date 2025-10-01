import { ColumnHeader } from '@/components/common/table/ColumnHeader'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Filter } from '@/types/components/table'
import { Switch } from '@/components/ui/switch'

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

export const countryColumns = (): ColumnDef<Country,any>[] => [
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <ColumnHeader column={column} title="Country Name" />
    ),
    cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
    enableSorting: false,
  }),
  columnHelper.accessor('short_name', {
    header: ({ column }) => <ColumnHeader column={column} title="Code" />,
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">{getValue()}</div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('phone_code', {
    header: ({ column }) => <ColumnHeader column={column} title="Phone Code" />,
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">+{getValue()}</div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('phone_length', {
    header: ({ column }) => (
      <ColumnHeader column={column} title="Phone Length" />
    ),
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">{getValue()}</div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('currency', {
    header: ({ column }) => <ColumnHeader column={column} title="Currency" />,
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">{getValue()}</div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('nationality', {
    header: ({ column }) => (
      <ColumnHeader column={column} title="Nationality" />
    ),
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">{getValue()}</div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('continent', {
    header: ({ column }) => <ColumnHeader column={column} title="Continent" />,
    cell: ({ getValue }) => (
      <div className="text-muted-foreground capitalize">{getValue()}</div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('is_active', {
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => {
      const isActive = getValue()
      return (
        <div className="flex items-center justify-center">
          <div className="p-1 rounded">
            <Switch checked={isActive} dir="ltr" disabled />
          </div>
          <div className="ml-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      )
    },
    enableSorting: false,
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) => <ColumnHeader column={column} title="Created At" />,
    cell: ({ getValue }) => {
      const date = new Date(getValue())
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return (
        <div className="text-sm space-y-1">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">
            {diffDays === 1 ? '1 day ago' : `${diffDays} days ago`}
          </div>
        </div>
      )
    },
    enableSorting: true,
    sortingFn: 'datetime',
  }),
]

export const countryFilters: Filter[] = [
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
]
