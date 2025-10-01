import UserDetailsPage from '@/components/pagesComponents/ShowUser'
import { RouterContext } from '@/main'
import { checkPermission } from '@/util/helpers'
import { prefetchWithUseFetchConfig } from '@/util/preFetcher'
import { usersQueryKeys } from '@/util/queryKeysFactory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/users/show/$id')({
  component: UserDetailsPage,
  loader: async ({ params, context }) => {
      const { queryClient } = context as RouterContext
      const endpoint = `users/${params.id}`
      await prefetchWithUseFetchConfig(queryClient, usersQueryKeys.getUser(params.id), endpoint);
    },
    beforeLoad:({location})=> checkPermission(/* location.href */'users.show'),
    
})

function RouteComponent() {
  return <div>Hello "/_main/users/show/id"!</div>
}
