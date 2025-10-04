import MainPageWrapper, {
  breadcrumbItem,
} from '@/components/layout/MainPageWrapper'
import Cities from '@/components/pagesComponents/Settings/cities'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { City } from '@/types/api/country'
import { ApiResponse } from '@/types/api/http'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { citiesQueryKeys, usersQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { Building2, Home, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
const endpoint = 'cities?paginate=1'
export const Route = createFileRoute('/_main/settings/cities/')({
  component: RouteComponent,
  validateSearch: (search) => {
    const searchParams: {
      page?: string
      is_active?: string
      search?: string
      sort?: string
      created_at?: string
      country_id?: string
    } = {
      page: search?.page as string,
      is_active: search.is_active as string,
      search: search.keyword as string,
      sort: search.sort as string,
      created_at: search.createdAt as string,
      country_id: search.country_id as string,
    }
    return searchParams
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    const { queryClient } = context as RouterContext
    await prefetchWithUseFetchConfig(
      queryClient,
      citiesQueryKeys.filterd(search),
      endpoint,
      {
        filters: {
          is_active: search.is_active,
          country_id: search.country_id,
          created_at: search.created_at,
        },
        sort: { created_at: search.sort },
      },
    )
  },
  //beforeLoad:({location})=> checkPermission(/* location.href */'users.index'),
})

function RouteComponent() {
  const search = Route.useSearch()
  const { t } = useTranslation()
  const { data } = useFetch<ApiResponse<City[], 'cities'>>({
    queryKey: citiesQueryKeys.filterd(search),
    endpoint,
    suspense: true,
    params: {
      filters: {
        is_active: search.is_active,
        country_id: search.country_id,
        created_at: search.created_at,
      },
      sort: { created_at: search.sort },
    },
  })
  const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.home'), icon: <Home />, to: '/' },
    { label: t('pages.cities'), icon: <Building2 /> },
  ]

  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <Cities data={data!} />
    </MainPageWrapper>
  )
}
