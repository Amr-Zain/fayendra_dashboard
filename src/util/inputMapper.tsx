import React from 'react'
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
} from 'react-hook-form'
import {
  FormControl,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FieldProp } from '@/types/components/form'
import OTPField from '@/components/common/form/OTPField'
import PhoneField from '@/components/common/form/PhoneField'
import PasswordField from '@/components/common/form/PasswordField'
import DateFields from '@/components/common/form/DatePicker'
import MapField from '@/components/common/form/MapField'
import MultiLangField from '@/components/common/form/MultiLangField'
import EditorField from '@/components/common/form/Editor/EditorField'
import FileUploadField from '@/components/common/form/Uploader/FileUploadField'
import AppSelect from '@/components/common/form/Select'


type FieldTypeOf<T extends FieldValues> = FieldProp<T>['type']

type FieldPropOfType<T extends FieldValues, K extends FieldTypeOf<T>> = Extract<
  FieldProp<T>,
  { type: K }
>
type FieldRenderArgs<T extends FieldValues, K extends FieldTypeOf<T>> = {
  props: FieldPropOfType<T, K>
  field: ControllerRenderProps<T, FieldPath<T>>
}

const ensureObj = <U extends object>(u: U | undefined): U => u ?? ({} as U);

type InputMapper<T extends FieldValues> = {
  [K in Exclude<FieldTypeOf<T>, 'custom'>]: (
    args: FieldRenderArgs<T, K>,
  ) => React.ReactNode
}
export const inputMapper = <T extends FieldValues>(): InputMapper<T> =>  ({
  text: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <Input
        type="text"
        placeholder={props.placeholder}
        {...field}
        {...inputProps}
      />
    )
  },
  number: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <Input
        type="number"
        placeholder={props.placeholder}
        {...field}
        {...inputProps}
      />
    )
  },
  email: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <Input
        type="email"
        placeholder={props.placeholder}
        {...field}
        {...inputProps}
      />
    )
  },
  password: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <PasswordField
        placeholder={props.placeholder || ''}
        {...field}
        {...inputProps}
      />
    )
  },
  textarea: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <Textarea
        placeholder={props.placeholder}
        rows={(inputProps as any).rows ?? 4}
        {...field}
        {...inputProps}
      />
    )
  },
  checkbox: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <div className="flex flex-row items-center space-x-3">
        <FormControl>
          <Checkbox
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={(inputProps as any).disabled}
            {...inputProps}
          />
        </FormControl>
        {props.label && (
          <FormLabel
            className="font-normal cursor-pointer"
            onClick={() => field.onChange(!field.value)}
          >
            {props.label}
          </FormLabel>
        )}
      </div>
    )
  },
  select: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return <AppSelect field={field} {...inputProps} />
  },
  radio: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    const radioOptions = props.options ?? []
    return (
      <RadioGroup
        onValueChange={field.onChange}
        value={field.value}
        className="flex flex-col space-y-1"
        disabled={(inputProps as any).disabled}
        {...inputProps}
      >
        {radioOptions.map((option) => (
          <div
            key={String(option.value)}
            className="flex items-center space-x-3"
          >
            <FormControl>
              <RadioGroupItem value={String(option.value)} />
            </FormControl>
            <FormLabel className="font-normal">{option.label}</FormLabel>
          </div>
        ))}
      </RadioGroup>
    )
  },
  otp: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <OTPField
        value={field.value || ''}
        onChange={(value) => {
          inputProps.handleOTPChange?.(value)
          field.onChange(value)
        }}
        length={inputProps.length ?? 6}
        disabled={inputProps.disabled}
        type={inputProps.type}
        {...inputProps}
      />
    )
  },
  phone: ({ props }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <PhoneField
        control={props.control!}
        phoneCodeName={
          (inputProps.phoneCodeName ?? `${String(props.name)}_code`) as Path<T>
        }
        phoneNumberName={
          (inputProps.phoneNumberName ??
            `${String(props.name)}_number`) as Path<T>
        }
        countries={(inputProps as any).countries ?? []}
        currentPhoneLimit={(inputProps as any).currentPhoneLimit}
        isLoading={inputProps.disabled}
        disabled={inputProps.disabled}
        codeClass={inputProps.codeClass}
        phoneClass={inputProps.phoneClass}
      />
    )
  },
  date: ({ props }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <DateFields
        control={props.control}
        name={props.name}
        label={props.label as string}
        placeholder={props.placeholder}
        mode={inputProps.mode}
        disabledDates={inputProps.disabledDates}
        className={inputProps.className}
      />
    )
  },
  map: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <MapField
        field={field}
        onMarkerPositionChange={inputProps.onMarkerPositionChange}
        defaultMarkerPosition={inputProps.defaultMarkerPosition}
        locations={inputProps.locations}
        zoom={inputProps.zoom}
        height={inputProps.height}
        mapContainerStyle={inputProps.mapContainerStyle}
        disabled={inputProps.disabled}
        className={inputProps.className}
      />
    )
  },
  editor: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <EditorField
        field={field}
        placeholder={props.placeholder}
        height={inputProps.height}
        toolbar={inputProps.toolbar}
        disabled={inputProps.disabled}
        className={inputProps.className}
      />
    )
  },
  multiLangField: ({ props }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <MultiLangField
        control={props.control!}
        name={String(props.name)}
        type={inputProps.type ?? 'input'}
        label={inputProps.labeling}
        placeholder={props.placeholder}
        languages={inputProps.languages}
        defaultLanguage={inputProps.defaultLanguage}
        disabled={inputProps.disabled}
        className={inputProps.className}
      />
    )
  },
  fileUpload: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <FileUploadField
        field={field}
        maxFiles={inputProps.maxFiles}
        maxSize={inputProps.maxSize}
        acceptedFileTypes={inputProps.acceptedFileTypes}
        multiple={inputProps.multiple}
        disabled={inputProps.disabled}
        className={inputProps.className}
        showPreview={inputProps.showPreview ?? true}
        shapeType={inputProps.shapeType ?? 'picture-card'}
        draggable={inputProps.draggable ?? true}
        type_file={inputProps.type_file}
        model={inputProps.model}
        apiEndpoint={inputProps.apiEndpoint}
        baseUrl={inputProps.baseUrl}
      />
    )
  },
  mediaUploader: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <FileUploadField
        field={field}
        maxFiles={inputProps.maxFiles}
        maxSize={inputProps.maxSize}
        acceptedFileTypes={inputProps.acceptedFileTypes}
        multiple={inputProps.multiple}
        disabled={inputProps.disabled}
        className={inputProps.className}
        showPreview={inputProps.showPreview ?? true}
        shapeType={inputProps.shapeType ?? 'picture-card'}
        draggable={inputProps.draggable ?? true}
        type_file={inputProps.type_file}
        model={inputProps.model}
        apiEndpoint={inputProps.apiEndpoint}
        baseUrl={inputProps.baseUrl}
      />
    )
  },
  imgUploader: ({ props, field }) => {
    const inputProps = ensureObj(props.inputProps)
    return (
      <FileUploadField
        field={field}
        maxFiles={inputProps.maxFiles}
        maxSize={inputProps.maxSize}
        acceptedFileTypes={['image/*']}
        multiple={inputProps.multiple}
        disabled={inputProps.disabled}
        className={inputProps.className}
        showPreview={inputProps.showPreview ?? true}
        shapeType={inputProps.shapeType ?? 'picture-card'}
        draggable={inputProps.draggable ?? true}
        type_file="image"
        model={inputProps.model}
        apiEndpoint={inputProps.apiEndpoint}
        baseUrl={inputProps.baseUrl}
      />
    )
  },
}
)