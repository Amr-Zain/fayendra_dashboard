import { ColumnDef, ColumnFiltersState, PaginationState, Row, SortingState } from "@tanstack/react-table";
import { ApiResponse, Meta } from "../api/http";
import { FieldOption } from "./form";
import { QueryKey } from "@tanstack/react-query";

export interface DataTableSearchParams {
  page?: number
  limit?: number
  search?: string
  filters?: Record<string, string | string[]>
  columns?: string[]
}
export interface Filter{
    id: string;
    title: string;
     options?: {
    label: string
    value: string
    // icon?: React.ComponentType<{ className?: string }>
  }[]
  general?: boolean
  multiple?: boolean
  endpoint?: string;
  select?: (data: ApiResponse) => FieldOption[]
  }
export interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  meta:Meta
  filters?: Filter[];
  searchKey?: string;
  pagination?: boolean;
  pageSizeOptions?: number[];
  initialState?: {
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    pagination?: PaginationState;
  };
  toolbar?: React.ReactNode;
  actions?: (row: Row<TData>) => React.ReactNode;
  selectable?: boolean;
  resizable?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  enableUrlState?: boolean; 
  exports?:{
    name: string;
    endpoint?: string
}
}


export type RowAction<RowData> = {
  label: string
  to?: string | ((row: RowData) => string)
  params?:
    | Record<string, string | number>
    | ((row: RowData) => Record<string, string | number>)
  onClick?: (row: RowData) => void | Promise<void>
  hidden?: (row: RowData) => boolean
  state?: { value: any }
  queryKey?: (id:string)=> QueryKey
  disabled?: boolean
  dividerAbove?: boolean
  danger?: boolean
}
