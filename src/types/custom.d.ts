declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.gif';
declare module '*.webp';
declare module '*.svg';
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_KEY: string
  readonly VITE_BASE_URL: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}