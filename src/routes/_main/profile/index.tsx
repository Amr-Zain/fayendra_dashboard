import Profile from '@/components/pagesComponents/Profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/profile/')({
  component: Profile,
})

function RouteComponent() {
  return <div>Hello "/_main/profile/"!</div>
}
