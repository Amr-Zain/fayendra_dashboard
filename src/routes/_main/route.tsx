import { DashboardHeader } from '@/components/layout/Header'
import { AppSidebar } from '@/components/layout/Sidebar'
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_main')({
  beforeLoad:({location})=>{
    console.log("seAuthStore.getState().user",useAuthStore.getState().user)
    if(!useAuthStore.getState().user){
       throw redirect({
        to: '/auth/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      })
    }
  },
  component: Layout,
})

function LayoutContent() {
  const { state } = useSidebar()

  return (
    <div
      className={cn(
        'flex-1 min-w-0 transition-all duration-300 ease-in-out',
        state === 'expanded'
          ? 'me-0 md:ms-[var(--sidebar-width)]'
          : 'me-0 md:ms-[var(--sidebar-width-icon)]',
      )}
    >
      <DashboardHeader />

      <main className="flex-1 overflow-auto">
        <div className="w-full p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export function Layout() {

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background rtl:flex-row-reverse">
          <AppSidebar />
          <LayoutContent />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
