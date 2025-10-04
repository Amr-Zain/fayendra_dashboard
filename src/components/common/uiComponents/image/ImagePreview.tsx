import React, { useEffect, useState, ImgHTMLAttributes, forwardRef } from 'react'
import fallbackSrc from '@/assets/icons/placeholder.svg'
import { Modal } from '../Modal'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  customFallbackSrc?: string
}

const ImageWithPreview = forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  ({ src, customFallbackSrc, className = '', alt = 'image', ...rest }, ref) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(
      typeof src === 'string' ? src : undefined
    )
    const [isFallback, setIsFallback] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)

    // If the incoming src changes, reset the state so we can try loading again
    useEffect(() => {
      setImgSrc(typeof src === 'string' ? src : undefined)
      setIsFallback(false)
    }, [src])

    const handleError = () => {
      if (!isFallback) {
        setImgSrc(customFallbackSrc || (fallbackSrc as unknown as string))
        setIsFallback(true)
      }
    }

    return (
      <div className={cn("relative group inline-block", className)}>
        <img
          ref={ref}
          {...rest}
          src={imgSrc || undefined}
          alt={alt}
          className={`${className} ${isFallback ? 'object-contain' : ''}`}
          onError={handleError}
        />

        <div className="pointer-events-none absolute inset-0 rounded-full transition-all duration-100 group-hover:bg-black/50">
          <div className="flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="pointer-events-auto">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setPreviewOpen(true)}
                className="size-8 p-0 hover:bg-transparent bg-transparent border-0"
                aria-label="Preview image"
                title="Preview"
              >
                <Eye className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {previewOpen && (
          <Modal
            isOpen={previewOpen}
            setIsOpen={() => setPreviewOpen(false)}
            contentClass="bg-transparent !w-[90vw] justify-center p-6 md:p-12 max-w-3xl border-none"
          >
            <img
              {...rest}
              src={imgSrc || undefined}
              alt={alt}
              className={`max-h-[80vh] w-auto ${isFallback ? 'object-contain' : ''}`}
              onError={handleError}
            />
          </Modal>
        )}
      </div>
    )
  }
)

ImageWithPreview.displayName = 'ImageWithPreview'
export default ImageWithPreview
