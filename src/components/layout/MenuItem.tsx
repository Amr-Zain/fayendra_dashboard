import { hasPermission, isPathActive } from '@/util/helpers'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'

import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useTranslation } from 'react-i18next'

export const MenuItem = ({ item }: { item: MenuItem }) => {
  const pathname = useLocation().pathname
  const hasSubItems = item.subItems && item.subItems.length > 0
  const isActive = isPathActive(item.url, pathname)
  const { i18n, t } = useTranslation()
  const { state } = useSidebar()

  const isRTL = i18n.dir() === 'rtl'
  if(item.permission && !hasPermission(item.permission))  return
  if (hasSubItems) {
    return (
      <Collapsible
        key={item.title}
        defaultOpen={isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem className={state ==='expanded'?"flex-col":''}>
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isActive} tooltip={item.title}>
                  <item.icon />
                  <span>{t(item.title)}</span>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="ml-auto h-5 w-fit px-1 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="rtl:rotate-180 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </TooltipTrigger>
            <TooltipContent side={isRTL ? 'left' : 'right'} align="center">
              {t(item.title)}
            </TooltipContent>
          </Tooltip>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item?.subItems?.map((subItem) => (
                <SidebarMenuSubItem key={t(subItem.title)}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isPathActive(subItem.url, pathname)}
                  >
                    <Link to={subItem.url}>
                      <span>{t(subItem.title)}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={isActive} tooltip={t(item.title)}>
        <Link to={item.url}>
          <item.icon />
          <span>{t(item.title)}</span>
          {item.badge && (
            <Badge variant="outline" className="ml-auto h-5 w-fit px-1 text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
