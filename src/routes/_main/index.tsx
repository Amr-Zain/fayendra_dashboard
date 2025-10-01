import MainPageWrapper, {
  breadcrumbItem,
} from '@/components/layout/MainPageWrapper'
import { Dashboard } from '@/components/pagesComponents/Dashboard'
import { createFileRoute } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_main/')({
  component: Index,
})

function Index() {
  const { t } = useTranslation()
  const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.dashboard'), icon: <Home /> },
  ]
  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
        <Dashboard />
    </MainPageWrapper>
  )
}

export default Index
