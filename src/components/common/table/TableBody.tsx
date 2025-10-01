import React from 'react'
import { flexRender, Row, Table } from '@tanstack/react-table'
import { TableBody, TableRow, TableCell } from '@/components/ui/table'

interface DataTableBodyProps<TData> {
  rows: Row<TData>[]
  columnCount: number
}

export function DataTableBody<TData>({
  rows,
  columnCount,
}: DataTableBodyProps<TData>) {
  if (!rows?.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columnCount} className="h-24 text-center">
            <div className="my-20 mx-auto flex-col flex items-center justify-center h-44 px-10 w-fit rounded-3xl shadow-sm border-primary/20">
              No Data Found
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
