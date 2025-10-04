import MainPageWrapper, { breadcrumbItem } from '@/components/layout/MainPageWrapper'
import { StaticPage } from '@/components/pagesComponents/StaticPages/Config'
import PageForm from '@/components/pagesComponents/StaticPages/Form'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { ApiResponse } from '@/types/api/http'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { pagesQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { Book, Edit, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_main/static-pages/edit/$id')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context as RouterContext
    const endpoint = `static-pages/${params.id}`
    await prefetchWithUseFetchConfig(
      queryClient,
      pagesQueryKeys.getPage(params.id),
      endpoint,
    )
  },
})

function RouteComponent() {
  const { id } = Route.useParams();
  const { t } = useTranslation()
  const { data } = useFetch<ApiResponse<StaticPage>, StaticPage>({
    queryKey: pagesQueryKeys.getPage(id),
    endpoint: `static-pages/${id}`,
    suspense: true,
    select: (data) => data.data as unknown as StaticPage,
  })

  const breadcrumbItems: breadcrumbItem[] = [
      { label: t('pages.home'), icon: <Home />, to: '/' },
      { label: t('pages.pages'), icon: <Book />, to: "/static-pages" },
      {label: t('buttons.edit'), icon: <Edit />}
   ]
  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <PageForm page={data}/>
    </MainPageWrapper>
  )
}
