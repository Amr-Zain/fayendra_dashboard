import Countries from '@/components/pagesComponents/Settings/Countries'
import useFetch from '@/hooks/UseFetch'
import { RouterContext } from '@/main'
import { ApiResponse } from '@/types/api/http'
import { createFileRoute } from '@tanstack/react-router'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { countriesQueryKeys } from '@/util/queryKeysFactory'


export type Country = {
  id: number
  name: string
  slug: string
  short_name: string
  phone_code: number
  phone_length: number
  currency: string
  nationality: string
  flag: string | null
  continent: string
  is_active: boolean
  created_at: string
}

const endpoint = 'countries?paginate=1'

export const Route = createFileRoute('/_main/settings/countries/')({
  component: RouteComponent,
  validateSearch: (search) => {
    const searchParams: {
      page?: string
      is_active?: string
      search?: string
      created_at?: string
    } = {
      page: search?.page as string,
      is_active: search.is_active as string,
      search: search.keyword as string,
      created_at: search.createdAt as string,
    }
    return searchParams
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    const { queryClient } = context as RouterContext
    await prefetchWithUseFetchConfig(
      queryClient,
      countriesQueryKeys.filterd(search),
      endpoint,
      {
        filters: {
          is_active: search.is_active,
          created_at: search.created_at,
        },
        sort: { },
      },
    )
  },
})

function RouteComponent() {
  const search = Route.useSearch()

  const { data } = useFetch<ApiResponse<Country[], 'countries'>>({
    queryKey: countriesQueryKeys.filterd(search),
    endpoint,
    suspense: true,
    params: {
      filters: {
        is_active: search.is_active,
        created_at: search.created_at,
      },
      sort: {  },
    },
  })

  return <Countries data={data!} />
}
