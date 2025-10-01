import CityForm from '@/components/pagesComponents/Settings/cities/CityFrom'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/settings/cities/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CityForm />
}
