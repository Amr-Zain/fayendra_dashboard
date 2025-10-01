// components/common/table/RenderRowActions.tsx
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'
import * as React from 'react'
import { RowAction } from '@/types/components/table'
import { cn } from '@/lib/utils'
import { QueryClient, QueryKey } from '@tanstack/react-query'

type RowActionsOptions<RowData> = {
  actions: RowAction<RowData>[]
  menuLabel?: string,
}

export function RowActions<RowData>({
  actions,
  menuLabel = 'Actions',
}: RowActionsOptions<RowData>) {
  return function RenderActions(row: { original: RowData }) {
    const r = row.original
    const queryClient = new QueryClient()
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Open menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>

          {actions
            .filter((a) => !(a.hidden?.(r) ?? false))
            .map((a, idx) => {
              const params =
                typeof a.params === 'function' ? a.params(r) : a.params
              const to = typeof a.to === 'function' ? a.to(r) : a.to

              const item = a.to ? (
                <DropdownMenuItem
                  key={`${idx}-${a.label}`}
                  asChild
                  disabled={a.disabled ?? false}
                  className={cn(
                    'cursor-pointer',
                    a.danger ? 'text-red-600' : '',
                  )}
                >
                  <Link
                    to={to!}
                    params={params as any}
                    //preload="intent"
                    onClick={() => {
                      console.log('query', r,a?.queryKey)
                      if (!!a?.queryKey){
                        const key = a.queryKey(String(r.id))
                        queryClient.setQueryData(key, r)
                        queryClient.setQueryDefaults(key, {
                          staleTime: 5 * 60 * 1000,
                        })
                      }
                    }}
                  >
                    {a.label}
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={`${idx}-${a.label}`}
                  onClick={() => !a.disabled && a.onClick?.(r)}
                  disabled={a.disabled ?? false}
                  className={a.danger ? 'text-red-600' : undefined}
                >
                  {a.label}
                </DropdownMenuItem>
              )

              return (
                <React.Fragment key={`${idx}-${a.label}-wrap`}>
                  {a.dividerAbove && <DropdownMenuSeparator />}
                  {item}
                </React.Fragment>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
