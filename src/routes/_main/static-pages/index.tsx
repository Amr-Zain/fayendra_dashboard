import MainPageWrapper, {
  breadcrumbItem,
} from '@/components/layout/MainPageWrapper'
import StaticPages from '@/components/pagesComponents/StaticPages'
import { StaticPage } from '@/components/pagesComponents/StaticPages/Config'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { ApiResponse } from '@/types/api/http'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { pagesQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { Book, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const endpoint = `static-pages?paginate=1`
export const Route = createFileRoute('/_main/static-pages/')({
  component: Index,
  validateSearch: (search) => {
    const searchParams: {
      page?: string
      is_ban?: string
      is_active?: string
      keyword?: string
    } = {
      page: search?.page as string,
      is_ban: search.is_ban as string,
      is_active: search.is_active as string,
      keyword: search.search as string,
    }
    return searchParams
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    const { queryClient } = context as RouterContext
    await prefetchWithUseFetchConfig(
      queryClient,
      pagesQueryKeys.filterd(search),
      endpoint,
      search,
    )
  },
  //beforeLoad:({location})=> checkPermission(/* location.href */'users.index'),
})

function Index() {
  const { t } = useTranslation()
  const search = Route.useSearch()

  const { data } = useFetch<ApiResponse<StaticPage[], 'static_pages'>>({
    queryKey: pagesQueryKeys.filterd(search),
    endpoint,
    suspense: true,
    params: { ...search },
  })
  const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.home'), icon: <Home />, to: '/' },
    { label: t('pages.pages'), icon: <Book /> },
  ]
  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <StaticPages data={data!} />
    </MainPageWrapper>
  )
}
