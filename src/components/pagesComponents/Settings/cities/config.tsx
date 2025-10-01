import { ColumnHeader } from '@/components/common/table/ColumnHeader'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { City, Country } from '@/types/api/country'
import { hasPermission } from '@/util/helpers'
import { Filter } from '@/types/components/table'
import { Dispatch, SetStateAction } from 'react'
import { Switch } from '@/components/ui/switch'
import { citiesQueryKeys } from '@/util/queryKeysFactory'

const columnHelper = createColumnHelper<City>()

export const cityColumns = (
  setModal: Dispatch<
    SetStateAction<{
      type: 'active' | 'delete'
      show: boolean
      id: string
    }>
  >,
) =>
  [
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <ColumnHeader column={column} title="City Name" />
      ),
      cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
      enableSorting: false,
    }),

    columnHelper.accessor('postal_code', {
      header: ({ column }) => (
        <ColumnHeader column={column} title="Postal Code" />
      ),
      cell: ({ getValue }) => (
        <div className="text-muted-foreground">{getValue()}</div>
      ),
      enableSorting: false,
    }),

    columnHelper.accessor('country.name', {
      header: ({ column }) => <ColumnHeader column={column} title="Country" />,
      cell: ({ getValue }) => (
        <div className="text-muted-foreground">{getValue()}</div>
      ),
      enableSorting: false,
    }),

    /* columnHelper.accessor('location.lat', {
    header: ({ column }) => <ColumnHeader column={column} title="Latitude" />,
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">{getValue()}</div>
    ),
  }),

  columnHelper.accessor('location.lng', {
    header: ({ column }) => <ColumnHeader column={column} title="Longitude" />,
    cell: ({ getValue }) => (
      <div className="text-muted-foreground">{getValue()}</div>
    ),
  }),
 */
    columnHelper.accessor('is_active', {
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: ({ row, getValue }) => {
        const isActive = getValue()
        return (
          <div className="flex items-center justify-center">
            <div
              onClick={() =>
                setModal({
                  show: true,
                  type: 'active',
                  id: row.original.id.toString(),
                })
              }
              className="cursor-pointer p-1 rounded hover:bg-muted transition-colors"
              title={
                isActive ? 'Click to deactivate city' : 'Click to activate city'
              }
            >
              <Switch checked={isActive} dir="ltr" />
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
      header: ({ column }) => (
        <ColumnHeader column={column} title="Created At" />
      ),
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
  ] as ColumnDef<City>[]

export const actions =(
  setModal: Dispatch<
    SetStateAction<{
      type: 'active'  | 'delete'
      show: boolean
      id: string
    }>
  >,
) => [
  {
    label: 'Edit city',
    to: '/settings/cities/edit/$id',
    params: (row: City) => ({ id: row.id.toString() }),
    disabled: hasPermission('cities.edit'),
    queryKey: (id:string)=>citiesQueryKeys.getCity(id)
  },
  {
    label: 'Delete city',
    danger: true,
     onClick: (row: City) =>
      setModal({ show: true, type: 'delete', id: row.id.toString() }),
  },
  {
    label: 'Activate/Deactivate city',
     onClick: (row: City) =>
      setModal({ show: true, type: 'active', id: row.id.toString() }),
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
