"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export interface UserLocation {
  lat: number
  lng: number
}

export interface UserSettings {
  language: 'ar'|'en'
  allow_notifications: boolean
}

export interface UserAuth {
  id: number
  name: string
  email: string
  phone_code: string
  phone: string
  image: string | null
  user_type: 'super_admin' | 'admin' | 'user' | string
  is_active: boolean
  is_verified: boolean
  is_banned: boolean
  is_suspended: boolean
  settings: UserSettings
  location: UserLocation
  token: string
  verification_token: string | null
}

interface AuthStore {
  user: UserAuth | null;
  token: string | null;
  setUser: (user: UserAuth) => void;
  updateUser: (user:any) => void;
  clearUser: () => void;
}

const cookieStorage = {
  getItem: (name: string): string | null => {
    try {
      return Cookies.get(name) ?? null;
    } catch (err) {
      console.error("cookie getItem error:", err);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      Cookies.set(name, value, {
        expires: 30,             
        secure: process.env.NODE_ENV === "production",
      });
    } catch (err) {
      console.error("cookie setItem error:", err);
    }
  },
  removeItem: (name: string): void => {
    try {
      Cookies.remove(name);
    } catch (err) {
      console.error("cookie removeItem error:", err);
    }
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => {
        set({ user, token: user.token ?? get().token });
      },
      updateUser: (values)=>{
        set({ user:{... get()?.user, ...values} });
        
      },
      clearUser: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
