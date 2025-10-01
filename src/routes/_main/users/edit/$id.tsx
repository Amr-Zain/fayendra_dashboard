import MainPageWrapper, { breadcrumbItem } from '@/components/layout/MainPageWrapper'
import UserForm from '@/components/pagesComponents/Users/UserForm'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { ApiResponse } from '@/types/api/http'
import { User } from '@/types/api/user'
import { checkPermission } from '@/util/helpers'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { usersQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, Home, Users2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_main/users/edit/$id')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context as RouterContext
    const endpoint = `users/${params.id}`
    await prefetchWithUseFetchConfig(
      queryClient,
      usersQueryKeys.getUser(params.id),
      endpoint,
    )
  },
  beforeLoad: ({ location }) =>
    checkPermission(/* location.href */ 'users.update'),
})

function RouteComponent() {
  const { t } = useTranslation()
  const {id} = Route.useParams()

  const { data } = useFetch<ApiResponse<User>,User>({
    queryKey: usersQueryKeys.getUser(id),
    endpoint: `users/${id}`,
    suspense: true,
    select:(data=>data.data)
  })
  const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.all_statistics'), icon: <Home />, to: '/' },
    { label: t('pages.users'), icon: <Users2 />, to: '/users' },
    { label: t('pages.edit'), icon: <Edit />},
  ]
  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <UserForm user={data!} />
    </MainPageWrapper>
  )
}
