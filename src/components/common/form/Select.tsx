'use client'

import { useEffect, useMemo, useState } from 'react'
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
import { ChevronsUpDown, Check, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'

import useFetch from '@/hooks/UseFetch'
import { FieldOption } from '@/types/components/form'
import { ApiResponse } from '@/types/api/http'
import { cn } from '@/lib/utils'

export type SelectInputProps<T extends FieldValues, TData = unknown> = {
  placeholder: string
  field: ControllerRenderProps<T, Path<T>>
  disabled?: boolean
  options?: FieldOption[]
  endpoint?: string
  general?: boolean
  select?: (data: ApiResponse<TData[]>) => FieldOption[]

  chunkSize?: number // Controls how many items are shown at a time
  debounceMs?: number // Debounce delay for search
}

function AppSelect<T extends FieldValues, TData>({
  placeholder,
  field,
  disabled,
  options,
  endpoint,
  general,
  select,

  chunkSize = 20,
  debounceMs = 300,
}: SelectInputProps<T, TData>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs)
    return () => clearTimeout(timer)
  }, [query, debounceMs])

  const { data, isPending } = useFetch<ApiResponse<TData[]>, FieldOption[]>({
    endpoint,
    queryKey: [endpoint],
    staleTime: 1200_000,
    general,
    select,
    enabled: !!endpoint,
  })

  const dataOptions = useMemo<FieldOption[]>(() => {
    if (endpoint) return data ?? []
    return options ?? []
  }, [endpoint, data, options])

  const filteredOptions = useMemo(() => {
    if (!debouncedQuery) return dataOptions
    const lowerQuery = debouncedQuery.toLowerCase()
    return dataOptions.filter(
      (option) =>
        (option?.label as string)?.toLowerCase().includes(lowerQuery) ||
        String(option.value).toLowerCase().includes(lowerQuery),
    )
  }, [debouncedQuery, dataOptions])

  const [visibleOptions, setVisibleOptions] = useState<FieldOption[]>([])
  useEffect(() => {
    setVisibleOptions(filteredOptions.slice(0, chunkSize))
  }, [filteredOptions, chunkSize])

  const handleShowMore = () => {
    setVisibleOptions((prev) => [
      ...prev,
      ...filteredOptions.slice(prev.length, prev.length + chunkSize),
    ])
  }

  // Handle the selection
  const selectedLabel = useMemo(() => {
    const selectedOption = dataOptions.find(
      (option) => String(option.value) === String(field.value),
    )
    return selectedOption?.label ?? ''
  }, [dataOptions, field.value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-56">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={query}
            onValueChange={(value) => setQuery(value)}
          />

          {/* Display Loading indicator */}
          {isPending && !!endpoint && (
            <div className="p-3 text-sm flex items-center gap-2 opacity-80">
              <Loader2 className="h-4 w-4 animate-spin" />
              loading ...
            </div>
          )}

          {/* Empty state for no results */}
          {filteredOptions.length === 0 ? (
            <CommandEmpty>No data Found</CommandEmpty>
          ) : (
            <CommandList style={{ maxHeight: 300, overflowY: 'auto' }}>
              <CommandGroup>
                {visibleOptions.map((option) => {
                  const isSelected =
                    String(option.value) === String(field.value)
                  return (
                    <CommandItem
                      key={String(option.value)}
                      value={String(option.value)}
                      onSelect={() => {
                        field.onChange(String(option.value))
                        setOpen(false)
                      }}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          'h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>

              {/* Show more button */}
              {filteredOptions.length > visibleOptions.length && (
                <button
                  type="button"
                  className="w-full text-sm py-2 opacity-80 hover:opacity-100"
                  onClick={handleShowMore}
                >
                  Show more
                </button>
              )}
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default AppSelect
