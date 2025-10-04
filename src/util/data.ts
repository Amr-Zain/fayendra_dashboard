import { BarChart3, Bell, Book, Building2, Calendar, CreditCard, Database, FileText, Flag, FolderOpen, HelpCircle, Home, Mail, Search, Settings, ShoppingCart, TrendingUp, Users, Users2 } from "lucide-react";

export const getDashboardMenuItems: MenuItem[] = [
  {
    title: 'menu.overview',
    url: '/',
    icon: Home,
  },
  {
    title: 'menu.analytics',
    url: '/analytics',
    icon: BarChart3,
    badge: 'Pro',
    /*     permission: 'statistics.index'
     */
  },
  {
    title: 'menu.pages',
    url: '/static-pages',
    icon: Book,
    //badge: 'Pro',
    /*     permission: 'users.index'
     */
  },
  {
    title: 'menu.users',
    url: '/users',
    icon: Users2,
    //badge: 'Pro',
    /*     permission: 'users.index'
     */
  },

  {
    title: 'menu.orders',
    url: '/orders',
    icon: ShoppingCart,
    badge: '23',
  },
  {
    title: 'menu.products',
    url: '/products',
    icon: Database,
    subItems: [
      { title: 'menu.allProducts', url: '/products/all' },
      {
        title: 'menu.categories',
        url: '/products/categories',
      },
      { title: 'menu.inventory', url: '/products/inventory' },
    ],
  },
]
export const getToolsMenuItems : MenuItem[] = [
  {
    title: 'menu.calendar',
    url: '/calendar',
    icon: Calendar,
  },
  {
    title: 'menu.messages',
    url: '/messages',
    icon: Mail,
    badge: '3',
  },
  {
    title: 'menu.fileManager',
    url: '/files',
    icon: FolderOpen,
  },
  {
    title: 'menu.search',
    url: '/search',
    icon: Search,
  },
]
export const getSettingsMenuItems: MenuItem[] = [
  {
    title: 'menu.generalSettings',
    url: '/settings/general',
    icon: Settings,
  },
  {
    title: 'menu.cities',
    url: '/settings/cities',
    icon: Building2,
  },
  {
    title: 'menu.countries',
    url: '/settings/countries',
    icon: Flag,
  },
  /*  {
    title: 'menu.billing') || 'Billing',
    url: '/billing',
    icon: CreditCard,
  }, */
  {
    title: 'menu.notifications',
    url: '/notifications',
    icon: Bell,
  },
  /*  {
    title: 'menu.helpSupport') || 'Help & Support',
    url: '/help',
    icon: HelpCircle,
  }, */
]
