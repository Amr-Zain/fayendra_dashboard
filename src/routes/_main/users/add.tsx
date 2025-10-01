import MainPageWrapper, {
  breadcrumbItem,
} from '@/components/layout/MainPageWrapper'
import UserForm from '@/components/pagesComponents/Users/UserForm'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { ApiResponse } from '@/types/api/http'
import { User } from '@/types/api/user'
import { checkPermission } from '@/util/helpers'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, Home, Users2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_main/users/add')({
    component: RouteComponent,
       beforeLoad:({location})=> checkPermission(/* location.href */'users.add'),
    
})

function RouteComponent() {
  const { t } = useTranslation()

  const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.all_statistics'), icon: <Home />, to: '/' },
    { label: t('pages.users'), icon: <Users2 />, to: '/users' },
    { label: t('pages.edit'), icon: <Edit /> },
  ]
  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <UserForm  />
    </MainPageWrapper>
  )
}
