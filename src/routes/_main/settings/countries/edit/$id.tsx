import MainPageWrapper, { breadcrumbItem } from '@/components/layout/MainPageWrapper'
import CountryForm from '@/components/pagesComponents/Settings/Countries/Form'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { CountryDetails } from '@/types/api/country'
import { ApiResponse } from '@/types/api/http'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { countriesQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, Flag, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'


export const Route = createFileRoute('/_main/settings/countries/edit/$id')({
  loader: async ({ params, context }) => {
    const { queryClient } = context as RouterContext
    await prefetchWithUseFetchConfig(
      queryClient,
      countriesQueryKeys.getCountry(params.id),
      `countries/${params.id}`,
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data } = useFetch<ApiResponse<CountryDetails>,CountryDetails>({
    queryKey: countriesQueryKeys.getCountry(id),
    endpoint: `countries/${id}`,
    suspense: true,
    select: (res) => res.data as unknown as CountryDetails,
  })

   const { t } = useTranslation()
     const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.home'), icon: <Home />, to: '/' },
    { label: t('pages.countries'), icon: <Flag />, to: '/settings/countries' },
    {label: t('buttons.Edit'), icon: <Edit />}

  ]

  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <CountryForm country={data!} />
    </MainPageWrapper>
  )
  return 
}
