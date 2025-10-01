import CityForm from '@/components/pagesComponents/Settings/cities/CityFrom'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { City } from '@/types/api/country'
import { ApiResponse } from '@/types/api/http'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { citiesQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/settings/cities/edit/$id')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context as RouterContext
    const endpoint = `cities/${params.id}`
    await prefetchWithUseFetchConfig(
      queryClient,
      citiesQueryKeys.getCity(params.id),
      endpoint,
    )
  },
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data } = useFetch<ApiResponse<City>, City>({
    queryKey: citiesQueryKeys.getCity(id),
    endpoint: `cities/${id}`,
    suspense: true,
    select: (data) => data.data as unknown as City,
  })
  return <CityForm city={data} />
}
