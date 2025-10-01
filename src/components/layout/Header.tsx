import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Menu, Search, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { useState, useMemo } from 'react'
import { useMutate } from '@/hooks/UseMutate'
import ConfirmModal from '../common/uiComponents/ConfirmModal'
import { Link, useNavigate } from '@tanstack/react-router'
import { ApiResponse } from '@/types/api/http'
import { toast } from 'sonner'

export function DashboardHeader() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const clearUser = useAuthStore((state) => state.clearUser)

  const [confirmOpen, setConfirmOpen] = useState(false)

  const navigate = useNavigate()
  const initials = useMemo(() => {
    const name = user?.full_name?.trim()
    if (!name) return 'A'
    return name
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }, [user?.full_name])

  // Logout mutation (adjust endpoint/method if needed)
  const { mutateAsync: logoutAsync, isPending: isLoggingOut } = useMutate<ApiResponse>({
    endpoint: 'logout',
    mutationKey: ['logout'],
    method: 'post',
    onSuccess:(data)=>{
      clearUser()
      toast.success(data.message)
      navigate({to:'/auth/login'})
    },
    onError:(_err, error)=>{
      toast.success(error.message)
    }
  })

  const handleConfirmLogout = async () => {
      await logoutAsync({})
  }

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4 relative">
          <SidebarTrigger
            className="p-2 hover:bg-accent rounded-md transition-colors flex md:hidden cursor-pointer"
            icon={<Menu />}
          />

          <div className="relative">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="ps-10 w-64 bg-background/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label={t('notifications')}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -end-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('notifications')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                aria-label={t('profile')}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.full_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
                <Link to={'/profile'}>
                  <DropdownMenuItem>
                    <User className="me-2 h-4 w-4" />
                    {t('profile')}
                  </DropdownMenuItem>
                </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault() 
                  setConfirmOpen(true)
                }}
              >
                {t('signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmModal
            title={t('confirmSignOutTitle') || 'Sign out?'}
            desc={
              t('confirmSignOutDescription') ||
              'You will be signed out of your account.'
            }
            open={confirmOpen}
            setOpen={setConfirmOpen}
            onClick={handleConfirmLogout}
            Pending={isLoggingOut}
            variant="destructive"
          />
        </div>
      </div>
    </header>
  )
}
