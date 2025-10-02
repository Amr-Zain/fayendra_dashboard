import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import AppUploader from "./Uploader";
import { FileUploadInputProps } from "@/types/components/uploader";
import { fileURLToPath } from "url";

export interface FileUploadFieldProps extends FileUploadInputProps {
  field: ControllerRenderProps<any, string>;
  className?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  maxFiles = 1,
  maxSize = 5,
  acceptedFileTypes = ['image/*'],
  multiple = false,
  disabled = false,
  className = '',
  showPreview = true,
  shapeType = 'picture-card',
  draggable = true,
  type_file = 'image',
  model = 'attachments',
  apiEndpoint = '/attachments',
  baseUrl,
}) => {
  // Convert acceptedFileTypes array to accept string
  const accept = acceptedFileTypes.join(',')

  // Handle initial file list - convert field value to UploadFile format if needed
  const getInitialFileList = () => {
    console.log('field.value', field.value)
    if (!field.value) return []

    // If field.value is already an array of UploadFile objects
    if (Array.isArray(field.value)) {
      return field.value
    }

    // If field.value is a single file object
    if(typeof field.value === 'string'){
      return [{ url: field.value }]
    }
    if (typeof field.value === 'object' && field.value.id) {
      return [
        {
          uid: field.value.id,
          name: field.value.name || 'uploaded-file',
          isUploading: false,
          url: field.value.url,
          response: { data: field.value },
        },
      ]
    }

    return []
  }

  // Handle file changes
  const handleChange = (value: any) => {
    console.log(value)
    if (multiple) {
      // For multiple files, expect an array
      field.onChange(value)
    } else {
      // For single file, pass just the file data
      field.onChange(value.hash)
    }
  }

  // Handle file removal
  const handleRemove = (fileList: any[]) => {
    if (multiple) {
      field.onChange(fileList.map((file) => file.response?.data || file))
    } else {
      field.onChange(null)
    }
  }

  return (
    <div className={className}>
      <AppUploader
        field={field}
        name={field.name}
        initialFileList={getInitialFileList()}
        onChange={handleChange}
        onRemove={handleRemove}
        maxCount={multiple ? maxFiles : 1}
        disabled={disabled}
        singleFile={!multiple}
        shapeType={shapeType}
        type_file={type_file}
        accept={accept}
        maxSize={maxSize}
        showPreview={showPreview}
        draggable={draggable}
        model={model}
        apiEndpoint={apiEndpoint}
        baseUrl={baseUrl}
      />
    </div>
  )
}

export default FileUploadField;