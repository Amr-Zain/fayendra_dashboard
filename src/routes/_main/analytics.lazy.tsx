import MainPageWrapper, { breadcrumbItem } from '@/components/layout/MainPageWrapper'
import { AnalyticsCharts } from '@/components/pagesComponents/Analytics'
import { createLazyFileRoute } from '@tanstack/react-router'
import { ChartAreaIcon, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/_main/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
    const { t } = useTranslation()
  const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.dashboard'), icon: <Home /> },
    { label: t('pages.analytics'), icon: <ChartAreaIcon /> },
  ]

  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <div className='mb-4'>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your performance metrics</p>
      </div>
      <AnalyticsCharts />
      
    </MainPageWrapper>
  )
}
