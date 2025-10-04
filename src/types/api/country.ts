
export interface Country {
  id: number
  short_name: string
  name: string
  flag: string | null
}

export type CountryDetails = {
  id: number
  name: string
  slug: string
  short_name: string
  phone_code: number
  phone_length: number
  currency: string
  nationality: string
  flag: string | null
  continent:
    | 'africa'
    | 'asia'
    | 'europe'
    | 'north-america'
    | 'south-america'
    | 'australia'
    | 'antarctica'
    | string
  is_active: boolean
  created_at: string
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
