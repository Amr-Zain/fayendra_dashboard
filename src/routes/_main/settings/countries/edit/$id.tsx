import CountryForm, {
  Country,
} from '@/components/pagesComponents/Settings/countries/Form'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { ApiResponse } from '@/types/api/http'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { createFileRoute } from '@tanstack/react-router'

const countryQueryKey = (id?: string) => ['country', id] as const

export const Route = createFileRoute('/_main/settings/countries/edit/$id')({
  loader: async ({ params, context }) => {
    const { queryClient } = context as RouterContext
    await prefetchWithUseFetchConfig(
      queryClient,
      countryQueryKey(params.id),
      `countries/${params.id}`,
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data } = useFetch<ApiResponse<Country>>({
    queryKey: countryQueryKey(id),
    endpoint: `countries/${id}`,
    suspense: true,
    select: (res) => res.data as unknown as Country,
  })
  return <CountryForm country={data!} />
}
