import MainPageWrapper, { breadcrumbItem } from '@/components/layout/MainPageWrapper'
import CountryForm from '@/components/pagesComponents/Settings/countries/Form'
import { createFileRoute } from '@tanstack/react-router'
import { Flag, Home, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_main/settings/countries/add')({


  component: () => {
    const { t } = useTranslation()
     const breadcrumbItems: breadcrumbItem[] = [
    { label: t('pages.home'), icon: <Home />, to: '/' },
    { label: t('pages.countries'), icon: <Flag />, to: '/settings/countries' },
    {label: t('buttons.add'), icon: <Plus />}

  ]

  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <CountryForm />
    </MainPageWrapper>
  )
},
})
