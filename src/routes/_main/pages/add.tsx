import PageForm from '@/components/pagesComponents/Pages/Form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/pages/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PageForm />
}
