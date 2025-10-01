import { Dispatch, SetStateAction, useMemo } from 'react'
import { Filter, RowAction } from '@/types/components/table'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Switch } from '@/components/ui/switch'
import { hasPermission } from '@/util/helpers'
import { ColumnHeader } from '@/components/common/table/ColumnHeader'
import { City } from '@/types/api/country'
import { User } from '@/types/api/user'

const columnHelper = createColumnHelper<User>()

export const userColumns = (
  setModal: Dispatch<
    SetStateAction<{
      type: 'active' | 'ban' | 'delete'
      show: boolean
      id: string
    }>
  >,
) =>
  [
    columnHelper.accessor('full_name', {
      header: ({ column }) => <ColumnHeader column={column} title="Name" />,
      cell: ({ getValue, row }) => (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium">
              {getValue()?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="font-medium">{getValue()}</div>
        </div>
      ),
    }),

    columnHelper.accessor('email', {
      header: ({ column }) => <ColumnHeader column={column} title="Email" />,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-muted-foreground max-w-[200px] truncate">
          {getValue()}
        </div>
      ),
    }),

    columnHelper.accessor('balance', {
      header: ({ column }) => <ColumnHeader column={column} title="Balance" />,
      cell: ({ getValue }) => {
        const balance = getValue()
        const numBalance =
          typeof balance === 'number' ? balance : parseFloat(balance || '0')
        return (
          <div
            className={`text-right font-mono ${
              numBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            $
            {numBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        )
      },
    }),

    columnHelper.accessor('is_ban', {
      header: ({ column }) => <ColumnHeader column={column} title="Banned" />,
      cell: ({ row, getValue }) => {
        const isBan = getValue()
        return (
          <div className="flex items-center justify-center">
            <div
              onClick={() =>
                setModal({
                  show: true,
                  type: 'ban',
                  id: row.original.id.toString(),
                })
              }
              className="cursor-pointer p-1 rounded hover:bg-muted transition-colors"
              title={isBan ? 'Click to unban user' : 'Click to ban user'}
            >
              <Switch checked={isBan} dir='ltr' />
            </div>
          </div>
        )
      },
      enableSorting: false,
    
    }),

    columnHelper.accessor('is_admin_active_user', {
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
                isActive ? 'Click to deactivate user' : 'Click to activate user'
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
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    }),

    columnHelper.accessor('phone_complete_form', {
      header: ({ column }) => <ColumnHeader column={column} title="Phone" />,
      cell: ({ getValue }) => {
        const phone = getValue()
        return (
          <div className="font-mono text-sm">
            {phone || (
              <span className="text-muted-foreground italic">No phone</span>
            )}
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
  ] as ColumnDef<User>[]

export const actions: (
  setModal: Dispatch<
    SetStateAction<{
      type: 'active' | 'ban' | 'delete'
      show: boolean
      id: string
    }>
  >,
) => RowAction<User>[] = (setModal: any) => [
  {
    label: 'Copy user ID',
    onClick: (row) => navigator.clipboard.writeText(row.id.toString()),
    disabled: hasPermission('users.update'),
  },
  {
    label: 'show user',
    to: '/users/show/$id',
    params: (row) => ({ id: row.id.toString() }),
    disabled: hasPermission('users.details'),
  },
  {
    label: 'Edit user',
    to: '/users/edit/$id',
    params: (row) => ({ id: row.id.toString() }),
    disabled: hasPermission('users.edit'),
  },
  {
    label: 'Delete user',
    danger: true,
    onClick: (row) =>
      setModal({ show: true, type: 'delete', id: row.id.toString() }),
  },
  {
    label: 'Ban/Unban user',
    onClick: (row) =>
      setModal({ show: true, type: 'ban', id: row.id.toString() }),
  },
  {
    label: 'Toggle Active',
    onClick: (row) =>
      setModal({ show: true, type: 'active', id: row.id.toString() }),
  },
]

export const filters: Filter[] = [
  {
    id: 'is_ban',
    title: 'Pan',
    options: [
      { label: 'Panned', value: '1' },
      { label: 'Not Panned', value: '0' },
    ],
    multiple: false,
  },
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
    id: 'city_id',
    title: 'City',
    endpoint: 'cities',
    general: true,
    select: (data) =>
      (data.data as City[]).map((city) => ({
        label: city.name,
        value: city.id,
      })),
    multiple: true,
  },
]
