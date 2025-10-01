
export interface Country {
  id: number
  short_name: string
  name: string
  flag: string | null
}

export interface Location {
  lat: number
  lng: number
  location: any 
}

export interface City {
  id: number
  name: string
  slug: string
  country: Country
  location: Location
  postal_code: string
  short_cut: string
  is_active: boolean
  created_at: string
}
