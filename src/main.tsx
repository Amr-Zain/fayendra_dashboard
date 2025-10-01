import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './styles.css'
import './i18n'
import {
  DefaultError,
  Mutation,
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

import { routeTree } from './routeTree.gen'
import NotFound from '@/components/common/uiComponents/NotFound'
import ErrorPage from './components/pagesComponents/ErrorPage'
import LoaderPage from './components/layout/Loader'
import NetworkWrapper from './components/common/uiComponents/NetworkWrapper'
import reportWebVitals from './reportWebVitals'
import { queryClient } from './components/providers/tabstackQueryProvider'
import { ThemeProvider } from './components/providers/themeProvider'

export type RouterContext = {
  queryClient: QueryClient
}

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultErrorComponent: ErrorPage,
  defaultNotFoundComponent: NotFound,
  defaultPendingComponent: LoaderPage,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
    context: RouterContext
  }
}

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoaderPage />}>
        <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
          <NetworkWrapper>
            <RouterProvider router={router} />
            <Toaster />
          </NetworkWrapper>
        </ThemeProvider>
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>,
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
