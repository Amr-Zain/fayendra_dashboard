import { useTranslation } from 'react-i18next'
// import { DataTable } from '@/components/common/table/AppTable'
import { BookOpen, Home } from 'lucide-react'

import { useParams } from '@tanstack/react-router'
import useFetch from '@/hooks/UseFetch'
import ProfileCard from './ProfileCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChargeWalletForm from './ChargeWalletForm'
import { hasPermission } from '@/util/helpers'
import { CarInfo } from './CarInfo'
import { Attachments } from './Attachments'
import { Transactions } from './transactions'
 import { ReviewDriverStatus } from './ReviewDriverStatus'
// import Trips from "@/pages/Trips";
import MainPageWrapper, {
  breadcrumbItem,
} from '@/components/layout/MainPageWrapper'
import { ApiResponse } from '@/types/api/http'
import { User } from '@/types/api/user'
import { usersQueryKeys } from '@/util/queryKeysFactory'


interface TabItem {
  value: string
  label: string
  content: React.ReactNode
}

export default function UserDetailsPage() {
  const { t } = useTranslation()
  const { id } = useParams({ from: '/_main/users/show/$id' })

  const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.home'), to: '/', icon: <Home /> },
    { label: t('pages.users'), to: '/users', icon: <BookOpen /> },
    { label: t('actions.show'), icon: <BookOpen /> },
  ]

  const { data: user } = useFetch<ApiResponse<User>,User>({
    queryKey: usersQueryKeys.getUser(id),
    endpoint: `users/${id}`,
    select: (data) => data.data,
    suspense: true
  })

  const tabsItems: TabItem[] = [
    hasPermission('transactions.show') && {
      value: 'transactions',
      label: t('labels.transactions'),
      content: <Transactions id={id!} />,
    },
    hasPermission('wallet.charge') && {
      value: 'charge-wallet',
      label: t('labels.charge_wallet'),
      content: <ChargeWalletForm id={id!} />,
    },
  ].filter(Boolean) as TabItem[]

  const status = user?.driver?.status

  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        {id && status && <ReviewDriverStatus id={id} status={status} />}
        {user && <ProfileCard user={user} status={status} />}
        {/* user?.user_type === "client" && (
          <Trips customUserEndpoint={`trips?user_id=${user.id}`} />
        ) */}
        {user?.driver && <CarInfo driver={user.driver}  />}
        {user?.driver && <Attachments driver={user.driver} />}

        {tabsItems.length > 0 && (
          <Tabs defaultValue={tabsItems[0]?.value} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              {tabsItems.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className='cursor-pointer'>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabsItems.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </MainPageWrapper>
  )
}
