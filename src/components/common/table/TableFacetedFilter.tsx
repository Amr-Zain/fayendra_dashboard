import React, { useMemo } from 'react'
import { Check, Loader2, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import useFetch from '@/hooks/UseFetch'
import { ApiResponse } from '@/types/api/http'
import { FieldOption } from '@/types/components/form'
import { Filter } from '@/types/components/table'

export function DataTableFacetedFilter<TData>({
  paramKey,
  title,
  options,
  multiple = true,
  setParam,
  currentValue,
  endpoint,
  select,
  general,
}: {
  paramKey: string
  setParam: (key: string, value: string | string[] | undefined) => void
  currentValue?: any
} & Filter) {
  const { data, isPending } = useFetch<ApiResponse<TData[]>, FieldOption[]>({
    endpoint,
    queryKey: [endpoint],
    staleTime: 120_000,
    select,
    general,
    enabled: !!endpoint,
  })

  const dataOptions = useMemo<FieldOption[]>(() => {
    if (endpoint) return data ?? []
    return options ?? []
  }, [endpoint, data, options])
  const selectedValues = React.useMemo(() => {
    if (multiple) {
      if (Array.isArray(currentValue)) return new Set(currentValue as string[])
      if (typeof currentValue === 'string' && currentValue.length > 0) {
        return new Set(
          currentValue
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        )
      }
      return new Set<string>()
    } else {
      if (typeof currentValue === 'string' && currentValue.length > 0) {
        return new Set([currentValue])
      }
      return new Set<string>()
    }
  }, [currentValue, multiple])

  const handleSelectionChange = (optionValue: string) => {
    if (multiple) {
      const next = new Set(selectedValues)
      if (next.has(optionValue)) next.delete(optionValue)
      else next.add(optionValue)
      const arr = Array.from(next)
      setParam(paramKey, arr.length ? arr : undefined)
    } else {
      const isSelected = selectedValues.has(optionValue)
      setParam(paramKey, isSelected ? undefined : optionValue)
    }
  }

  const clearFilter = () => setParam(paramKey, undefined)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
          disabled={isPending && !!endpoint} 
        >
           {isPending && endpoint ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              {multiple ? (
                <>
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {selectedValues.size}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedValues.size > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {selectedValues.size} selected
                      </Badge>
                    ) : (
                      dataOptions
                        .filter((opt) =>
                          selectedValues.has(opt.value.toString()),
                        )
                        .map((opt) => (
                          <Badge
                            variant="secondary"
                            key={opt.value}
                            className="rounded-sm px-1 font-normal"
                          >
                            {opt.label}
                          </Badge>
                        ))
                    )}
                  </div>
                </>
              ) : (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {
                    dataOptions.find((opt) =>
                      selectedValues.has(opt.value.toString()),
                    )?.label
                  }
                </Badge>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            {isPending && endpoint ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) :<>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {dataOptions.map((option) => {
                const isSelected = selectedValues.has(option.value.toString())
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() =>
                      handleSelectionChange(option.value.toString())
                    }
                  >
                    {multiple ? (
                      <div
                        className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                    )}
                    {/* {option?.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )} */}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearFilter}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}</>}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
