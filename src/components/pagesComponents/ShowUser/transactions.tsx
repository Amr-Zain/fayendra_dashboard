import { DataTable } from '@/components/common/table/AppTable'
import useFetch from '@/hooks/UseFetch'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { ApiResponse } from '@/types/api/http'

import { formatDate, subtractDays } from '@/util/date'
import { tranactionsQueryKeys } from '@/util/queryKeysFactory'
import LoaderPage from '@/components/layout/Loader'
import { Transaction } from '@/types/api/user'
import { ColumnHeader } from '@/components/common/table/ColumnHeader'
import { Skeleton } from '@/components/ui/skeleton'

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

interface TransactionsProps {
  id: string
}
const TransactionsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Balance and Date Filter Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-[280px]" />
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="rounded-md border">
          <div className="border-b p-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
          <div className="p-4 flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export const Transactions = ({ id }: TransactionsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: subtractDays(new Date(), 30), // 30 days ago
    to: addDays(new Date(), 1), // tomorrow
  })

  const endpoint = `transactions/${id}`

  const { data: transactionsData, isPending } = useFetch<
    ApiResponse<{
      balance: number
      transactions: Transaction[]
    }>
  >({
    endpoint: endpoint,
    queryKey: tranactionsQueryKeys.FilterdTransctions({
      userId: id,
      from: formatDate(dateRange.from),
      to: formatDate(dateRange.to),
    }),
    params: {
      from_date: formatDate(dateRange.from),
      to_date: formatDate(dateRange.to),
    },
    staleTime: 1800000, // 30 minutes
    //suspense: true,
  })
  const columnHelper = createColumnHelper<Transaction>()

  const transactionColumns: ColumnDef<Transaction, any>[] = [
  columnHelper.accessor('id', {
    header: ({ column }) => <ColumnHeader column={column} title={t('labels.transactions')} />,
    cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    enableSorting:false
  }),
  columnHelper.accessor('balance_before', {
    header: ({ column }) => <ColumnHeader column={column} title={t('labels.balance_before')} />,
    cell: ({ row }) => (
      <div>
        {row.original.balance_before} {t('labels.currency')}
      </div>
    ),
  }),
  columnHelper.accessor('balance_after', {
    header: ({ column }) => <ColumnHeader column={column} title={t('labels.balance_after')} />,
    cell: ({ row }) => (
      <div>
        {row.original.balance_after} {t('labels.currency')}
      </div>
    ),
  }),
  columnHelper.accessor('amount', {
    header: ({ column }) => <ColumnHeader column={column} title={t('labels.amount')} />,
    cell: ({ row }) => (
      <div
      className={cn(
        'font-semibold',
        row.original.type === 'charge' ? 'text-green-600' : 'text-red-600',
      )}
      >
        {row.original.type === 'charge' ? '+' : '-'}
        {row.original.amount} {t('labels.currency')}
      </div>
    ),
  }),
  columnHelper.accessor('type', {
    header: ({ column }) => <ColumnHeader column={column} title={t('labels.type')} />,
    cell: ({ row }) => (
      <div
      className={cn(
        'px-2 py-1 rounded-full text-xs font-semibold',
        row.original.type === 'charge'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800',
      )}
      >
        {t(`labels.${row.original.type}`)}
      </div>
    ),
    enableSorting:false
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) => <ColumnHeader column={column} title={t('labels.created_at')} />,
    cell: ({ row }) => <div>{formatDate(new Date(row.original.created_at), 'PPP')}</div>,
    enableSorting: true,
  }),
  columnHelper.accessor('created_time', {
    header: ({ column }) => <ColumnHeader column={column} title={t('labels.return_time')} />,
    cell: ({ row }) => <div>{row.original.created_time}</div>,
    enableSorting: true,
  }),
]

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range)
    const searchParams = new URLSearchParams()
    searchParams.set('from_date', formatDate(range.from))
    searchParams.set('to_date', formatDate(range.to))

    navigate({
      search: Object.fromEntries(searchParams) as any,
      replace: true,
    })
  }
  if(isPending)return<TransactionsSkeleton />
  return (

    <div className="space-y-6">
      {/* Balance and Date Filter Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-lg font-semibold">
              <span className="text-muted-foreground">
                {t('labels.balance')}:
              </span>
              <span className="ml-2 text-primary">
                {transactionsData?.data?.balance} {t('labels.currency')}
              </span>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {formatDate(dateRange.from, 'LLL dd, y')} -{' '}
                        {formatDate(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      formatDate(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>{t('labels.pick_date_range')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      handleDateRangeChange({
                        from: range.from,
                        to: range.to,
                      })
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <DataTable
        columns={transactionColumns}
        data={transactionsData?.data?.transactions || []}
        meta={transactionsData?.meta!}
        pagination={true}
        pageSizeOptions={[10, 20, 30, 50]}
        enableUrlState={true}
        exports={{
          name: `transactions-${id}`,
          //columns: ["id", "amount", "type", "created_at"],
        }}
      />
    </div>
  )
}
