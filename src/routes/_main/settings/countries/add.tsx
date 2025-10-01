import CountryForm from '@/components/pagesComponents/Settings/countries/Form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/settings/countries/add')({
  component: () => <CountryForm />,
})
