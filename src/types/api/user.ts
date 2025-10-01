import { City } from "./country"


type DriverStatus = 'pending' | 'accepted' | 'rejected'

interface Driver {
  status: DriverStatus
  car_image?: string
  car_brand?: string
  car_model?: string
  car_color?: string
  car_year?: string
  car_letter_ar?: string
  car_number_ar?: string
  car_license?: string
  car_license_back?: string
  car_check?: string
  driver_license?: string
  driver_license_back?: string
  national_id?: string
  national_id_back?: string
  criminal_record?: string
}

export interface User {
  allow_notifications: boolean;
  balance: number;
  city: City;
  country: string | null;
  created_at: string;
  driver: Driver;
  email: string | null;
  full_name: string;
  gender: string;
  id: number;
  image: string;
  is_active: boolean;
  is_admin_active_user: boolean;
  is_ban: boolean;
  locale: string;
  phone: string;
  phone_code: string;
  phone_complete_form: string;
  promotional_code: string | null;
  reviews: any[]; // Consider creating a specific interface for Review if needed
  unread_notifications: number;
  user_type: "driver" | "client"; 
}

export interface Transaction {
  id: string
  balance_before: number
  balance_after: number
  amount: number
  type: string
  created_at: string
  created_time: string
}
