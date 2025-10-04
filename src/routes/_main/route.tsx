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
import ConfirmModal from '@/components/common/uiComponents/ConfirmModal'
import { useAlertModal } from '@/stores/useAlertModal'
import { toast } from 'sonner'

export const Route = createFileRoute('/_main')({
  beforeLoad:({location})=>{
    const user = useAuthStore.getState().user;
    if(!useAuthStore.getState().token){
       throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
    if(user?.is_banned){
      toast('your account had bannded')
       throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
    if(!user?.is_active){
       toast('your account not activated')
       throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: Layout,
})

function LayoutContent() {
  const { state } = useSidebar()
  const {
    isOpen,
    title,
    desc,
    variant,
    pending,
    setIsOpen,
    handleConfirm,
  } = useAlertModal(); 
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
      
     <ConfirmModal
      title={title!}
      desc={desc!}
      open={isOpen}
      setOpen={setIsOpen}
      onClick={handleConfirm!}
      Pending={!!pending}
      variant={variant}
    />
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
