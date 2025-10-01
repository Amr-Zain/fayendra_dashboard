import MainPageWrapper, { breadcrumbItem } from '@/components/layout/MainPageWrapper'
import Users from '@/components/pagesComponents/Users'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { ApiResponse } from '@/types/api/http'
import { User } from '@/types/api/user'
import { checkPermission } from '@/util/helpers'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { usersQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { Home, Users2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'



const endpoint = `users?user_type=client`
export const Route = createFileRoute('/_main/users/')({
  component: Index,
  validateSearch: (search) => {
    const searchParams: { page?: string; is_ban?: string; is_active?: string; keyword?: string} = {
      page: search?.page as string,
      is_ban: search.is_ban as string,
      is_active: search.is_active as string,
      keyword: search.keyword as string,
    }
    return searchParams
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    const { queryClient } = context as RouterContext
    await prefetchWithUseFetchConfig(
      queryClient,
      usersQueryKeys.usersFilterd(search),
      endpoint,
      search,
    )
  },
   beforeLoad:({location})=> checkPermission(/* location.href */'users.index'),
})

function Index() {
  const { t } = useTranslation()
  const search = Route.useSearch()

  const { data } = useFetch<ApiResponse<User[]>>({
    queryKey: usersQueryKeys.usersFilterd(search),
    endpoint,
    suspense: true,
    params: { ...search },
  })
  const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.all_statistics'), icon: <Home /> ,to:'/'},
    { label: t('pages.users'), icon: <Users2 />},
  ]
  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <Users data={data!} />
    </MainPageWrapper>
  )
}