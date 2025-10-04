import { ColumnDef, createColumnHelper, CellContext } from '@tanstack/react-table'
import { ColumnHeader } from '@/components/common/table/ColumnHeader'
import { Switch } from '@/components/ui/switch'
import ImageWithPreview from '../common/uiComponents/image/ImagePreview'

export type WithId = { id: number | string }
export type WithActive = { is_active: boolean }
export type WithCreatedAt = { created_at: string }


const ch = <T,>() => createColumnHelper<T>()

export function textColumn<T>(
  key: keyof T & string,
  title: string,
  opts?: { sortable?: boolean; render?: (ctx: CellContext<T, any>) => React.ReactNode },
): ColumnDef<T> {
  return ch<T>().accessor(key as any, {
    header: ({ column }) => <ColumnHeader column={column} title={title} />,
    cell: (ctx) =>
      opts?.render ? (
        opts.render(ctx)
      ) : (
        <div className="text-muted-foreground line-clamp-1">{String(ctx.getValue() ?? '')}</div>
      ),
    enableSorting: !!opts?.sortable,
  })
}

export function imageColumn<T>(
  key: keyof T & string,
  title: string,
  opts?: { sortable?: boolean; render?: (ctx: CellContext<T, any>) => React.ReactNode },
): ColumnDef<T> {
  return ch<T>().accessor(key as any, {
    header: ({ column }) => <ColumnHeader column={column} title={title} />,
    cell: (ctx) =>
      opts?.render ? (
        opts.render(ctx)
      ) : (
         <ImageWithPreview
            src={String(ctx.getValue())}
            alt="page"
            className="size-12 rounded-full border border-border"
          />
      ),
    enableSorting: !!opts?.sortable,
  })
}


export function statusColumn<T extends WithActive>(
  open: (type: 'active' | 'delete', row: T) => void,
  title = 'Status',
): ColumnDef<T> {
  return ch<T>().accessor('is_active' as any, {
    header: ({ column }) => <ColumnHeader column={column} title={title} />,
    cell: ({ row, getValue }) => {
      const isActive = Boolean(getValue())
      return (
        <div
          className="flex items-center gap-2 cursor-pointer"
          title={isActive ? 'Click to deactivate' : 'Click to activate'}
          onClick={(e) => {
            e.stopPropagation()
            open('active', row.original)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              open('active', row.original)
            }
          }}
          role="button"
          tabIndex={0}
        >
          <Switch checked={isActive} />
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },
    enableSorting: false,
  })
}

export function createdAtColumn<T extends WithCreatedAt>(
  title = 'Created At',
): ColumnDef<T> {
  return ch<T>().accessor('created_at' as any, {
    header: ({ column }) => <ColumnHeader column={column} title={title} />,
    cell: ({ getValue }) => {
      const dateStr = getValue() as unknown as string
      const date = new Date(dateStr)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return (
        <div className="text-sm space-y-1">
          <div>{isNaN(date.getTime()) ? '-' : date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">
            {isNaN(date.getTime())
              ? ''
              : diffDays === 1
              ? '1 day ago'
              : `${diffDays} days ago`}
          </div>
        </div>
      )
    },
    enableSorting: true,
    sortingFn: 'datetime',
  })
}
