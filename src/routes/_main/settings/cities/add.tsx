import MainPageWrapper, {
  breadcrumbItem,
} from '@/components/layout/MainPageWrapper'
import CityForm from '@/components/pagesComponents/Settings/cities/CityFrom'
import { createFileRoute } from '@tanstack/react-router'
import { Building2, Home, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_main/settings/cities/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.home'), icon: <Home />, to: '/' },
    { label: t('pages.cities'), icon: <Building2 />, to: '/settings/cities' },
    { label: t('buttons.add'), icon: <Plus /> },
  ]

  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <CityForm />
    </MainPageWrapper>
  )
}
