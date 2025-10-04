import MainPageWrapper, { breadcrumbItem } from '@/components/layout/MainPageWrapper'
import PageForm from '@/components/pagesComponents/StaticPages/Form'
import { createFileRoute } from '@tanstack/react-router'
import { Book, Home, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_main/static-pages/add')({
  component: RouteComponent,
})
function RouteComponent() {
  const { t } = useTranslation()
  const breadcrumbItems: breadcrumbItem[] = [
      { label: t('pages.home'), icon: <Home />, to: '/' },
      { label: t('pages.pages'), icon: <Book />, to: "/static-pages" },
      {label: t('buttons.add'), icon: <Plus />}
   ]
  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <PageForm />
    </MainPageWrapper>
  )
}
