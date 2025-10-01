'use client'

import React from 'react'
import {
  FieldPath,
  FieldValues,
} from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FieldProp } from '@/types/components/form'

import { inputMapper } from '@/util/inputMapper'

function Field<T extends FieldValues>(props: FieldProp<T>) {
  if (props.type === 'custom') {
    return props.customItem as React.ReactElement
  }

  return (
    <FormField
      control={props.control}
      name={props.name as FieldPath<T>}
      render={({ field }) => {
        const spanClass = props.span ? `col-span-${props.span} self-center` : ''
        const mapper = inputMapper<T>()
        const content = (mapper[props.type ] as any)({ props, field })
        return (
          <FormItem
            className={`${props.type === 'checkbox' ? 'mt-6' : 'space-y-2'} ${spanClass}`}
          >
            {props.type !== 'checkbox' && props.label && (
              <FormLabel>{props.label}</FormLabel>
            )}
            <FormControl>{content}</FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default Field
