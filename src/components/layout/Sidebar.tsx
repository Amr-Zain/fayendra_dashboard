import {
  ChevronDown,
  CreditCard,
  User2,
  Bell,
  LogOut,
  PieChart,
  ChevronsRight,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useTranslation } from 'react-i18next'
import {
  getDashboardMenuItems,
  getSettingsMenuItems,
  getToolsMenuItems,
} from '@/util/data'
import { MenuItem } from './MenuItem'
import { cn } from '@/lib/utils'

// App Sidebar Component
export function AppSidebar() {
  const { t, i18n } = useTranslation()
  const { state } = useSidebar()
  const isRTL = i18n.dir() === 'rtl'

  const groups = [
    {
      label: t('menu.dashboard'),
      items: getDashboardMenuItems,
    },
    {
      label: t('menu.settings'),
      items: getSettingsMenuItems,
    },
    {
      label: t('menu.tools'),
      items: getToolsMenuItems,
    },
  ]

  return (
    <Sidebar
      side={isRTL ? 'right' : 'left'}
      collapsible="icon"
      className={`fixed h-screen ${
        state === 'expanded'
          ? 'w-[var(--sidebar-width)]'
          : 'w-[var(--sidebar-width-icon)]'
      }`}
    >
      <SidebarHeader className="group">
        <SidebarMenu>
          <SidebarMenuItem
          >
            <SidebarMenuButton
              size="lg"
              className={cn(
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground relative',
                state === 'collapsed' ? 'flex group-hover:hidden' : 'flex',
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <h2 className="font-semibold text-sidebar-foreground truncate">
                  {t('dashboard')}
                </h2>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {t('adminPanel')}
                </p>
              </div>
            </SidebarMenuButton>
            <SidebarTrigger className={cn("p-2 w-7 h-7 rounded-full transition-colors cursor-w-resize", state === 'expanded'?"flex":'hidden group-hover:flex')} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group, index) => (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <MenuItem item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index > groups.length - 1 && <SidebarSeparator />}
          </>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex-col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <User2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {t('user.name') || 'Admin User'}
                    </span>
                    <span className="truncate text-xs">
                      {t('user.email') || 'admin@company.com'}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="top"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User2 />
                  <span>{t('user.account')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  <span>{t('user.billing')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  <span>{t('user.notifications')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut />
                  <span>{t('user.signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
