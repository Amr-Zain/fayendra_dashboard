"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export interface User {
  token: string
  full_name: string
  email: string
  image: string
  phone_complete_form: string
  permission: { url: string; back_route_name: string }[]
  [key: string]: any
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// Create a custom storage object for Zustand that uses js-cookie
const createCookieStorage = () => {
  return {
    getItem: (name: string): string | null => {
      try {
        return Cookies.get(name) || null;
      } catch (error) {
        console.error("Error getting cookie:", error);
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        // Set cookie with 30 days expiration and appropriate options
        Cookies.set(name, value, { 
          expires: 30, 
          path: '/',
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        });
      } catch (error) {
        console.error("Error setting cookie:", error);
      }
    },
    removeItem: (name: string): void => {
      try {
        Cookies.remove(name, { path: '/' });
      } catch (error) {
        console.error("Error removing cookie:", error);
      }
    },
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => {
        set({ user, token: user.token ? user.token : get().token })
      },
      clearUser: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(()=>(localStorage)),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);