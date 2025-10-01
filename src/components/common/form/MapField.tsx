// src/components/common/form/MapField.tsx
import * as React from 'react'
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polygon,
} from '@react-google-maps/api'
import { FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'

export interface Position {
  lat: number
  lng: number
}

export interface MapFieldProps<T extends FieldValues> {
  onMarkerPositionChange?: (position: Position) => void
  defaultMarkerPosition?: Position
  className?: string
  height?: number
  locations?: Position[] // Optional: show existing points/polygon
  zoom?: number
  mapContainerStyle?: React.CSSProperties
  field?: ControllerRenderProps<T, Path<T>>
  disabled?: boolean
}

const DEFAULT_CENTER: Position = { lat: 31.0276005, lng: 31.3755931 }

function coercePos(val: unknown): Position | null {
  if (!val || typeof val !== 'object') return null
  const v = val as any
  if (typeof v.lat === 'number' && typeof v.lng === 'number') {
    return { lat: v.lat, lng: v.lng }
  }
  return null
}

export default function MapField<T extends FieldValues>({
  field,
  onMarkerPositionChange,
  defaultMarkerPosition,
  className,
  height = 420,
  locations,
  zoom = 12,
  mapContainerStyle,
  disabled = false,
}: MapFieldProps<T>) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = React.useState<google.maps.Map | null>(null)
  const [marker, setMarker] = React.useState<Position | null>(
    coercePos(field?.value) ?? defaultMarkerPosition ?? null,
  )
  const [geoCenter, setGeoCenter] = React.useState<Position | null>(null)

  // Try to get user location once (fallback to DEFAULT_CENTER)
  React.useEffect(() => {
    let cancelled = false
    if (!geoCenter && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return
          setGeoCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {
          if (cancelled) return
          setGeoCenter(DEFAULT_CENTER)
        },
        { enableHighAccuracy: false, maximumAge: 60_000 },
      )
    } else if (!geoCenter) {
      setGeoCenter(DEFAULT_CENTER)
    }
    return () => {
      cancelled = true
    }
  }, [geoCenter])

  // Sync external form value -> local marker
  React.useEffect(() => {
    const v = coercePos(field?.value)
    if (v && (v.lat !== marker?.lat || v.lng !== marker?.lng)) {
      setMarker(v)
    }
  }, [field?.value]) // eslint-disable-line react-hooks/exhaustive-deps

  const center: Position =
    marker ??
    (locations && locations.length > 0 ? locations[0] : undefined) ??
    geoCenter ??
    DEFAULT_CENTER

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height,
    borderRadius: 8,
    ...mapContainerStyle,
  }

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (disabled || !e.latLng) return
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
    setMarker(pos)
    onMarkerPositionChange?.(pos)
    field?.onChange?.(pos)
  }

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (disabled || !e.latLng) return
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
    setMarker(pos)
    onMarkerPositionChange?.(pos)
    field?.onChange?.(pos)
  }

  return (
    <FormItem className={cn('w-full', className)}>
      <FormControl>
        <div className="relative w-full">
          {isLoaded && center ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={zoom}
              onLoad={(m) => setMap(m)}
              onUnmount={() => setMap(null)}
              onClick={handleClick}
              options={{
                disableDefaultUI: disabled,
                draggable: !disabled,
                clickableIcons: !disabled,
                keyboardShortcuts: !disabled,
              }}
            >
              {/* Primary marker (editable) */}
              {marker && (
                <Marker
                  position={marker}
                  draggable={!disabled}
                  onDragEnd={handleDragEnd}
                />
              )}

              {/* Optional: read-only markers/polygon from locations */}
              {Array.isArray(locations) &&
                locations.map((p, i) => (
                  <Marker key={`loc_${i}`} position={p} />
                ))}

              {Array.isArray(locations) && locations.length > 2 && (
                <Polygon
                  paths={locations}
                  options={{
                    fillColor: '#FF0000',
                    fillOpacity: 0.2,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    clickable: false,
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            // You can swap this with your AppSkeleton if you prefer
            <div
              className="w-full animate-pulse rounded-md bg-muted"
              style={{ height }}
            />
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
