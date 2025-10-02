import { ColumnHeader } from '@/components/common/table/ColumnHeader'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Dispatch, SetStateAction } from 'react'
import { Switch } from '@/components/ui/switch'

export type StaticPage = {
  id: number
  type: string
  title: string
  image: string | null
  content: string
  is_active: boolean
  created_at: string
}

const columnHelper = createColumnHelper<StaticPage>()

export const staticPagesColumns = (
  setModal: Dispatch<
    SetStateAction<{
      type: 'active' | 'delete'
      show: boolean
      id: string
    }>
  >,
): ColumnDef<StaticPage>[] =>
  [
    columnHelper.accessor('title', {
      header: ({ column }) => <ColumnHeader column={column} title="Title" />,
      cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
      enableSorting: false,
    }),
    columnHelper.accessor('type', {
      header: ({ column }) => <ColumnHeader column={column} title="Type" />,
      cell: ({ getValue }) => (
        <div className="text-muted-foreground">{getValue()}</div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('image', {
      header: ({ column }) => <ColumnHeader column={column} title="Image" />,
      cell: ({ getValue }) => {
        const src = getValue()
        return src ? (
          <img
            src={src}
            alt="page"
            className="h-10 w-16 rounded-md object-cover border border-border"
          />
        ) : (
          <div className="text-xs text-muted-foreground">—</div>
        )
      },
      enableSorting: false,
    }),
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
                isActive ? 'Click to deactivate page' : 'Click to activate page'
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
  ] as ColumnDef<StaticPage>[]

// Row actions (Edit / Delete / Toggle)
export const actions = (
  setModal: Dispatch<
    SetStateAction<{
      type: 'active' | 'delete'
      show: boolean
      id: string
    }>
  >,
  queryKeys: {
    get: (id: string) => readonly unknown[]
  },
) => [
  {
    label: 'Edit',
    to: '/settings/static-pages/edit/$id',
    params: (row: StaticPage) => ({ id: row.id.toString() }),
    queryKey: (id: string) => queryKeys.get(id),
  },
  {
    label: 'Delete',
    danger: true,
    onClick: (row: StaticPage) =>
      setModal({ show: true, type: 'delete', id: row.id.toString() }),
  },
  {
    label: 'Activate/Deactivate',
    onClick: (row: StaticPage) =>
      setModal({ show: true, type: 'active', id: row.id.toString() }),
  },
]
