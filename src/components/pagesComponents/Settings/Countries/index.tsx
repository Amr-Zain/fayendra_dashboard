import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { Link } from '@tanstack/react-router'
import { countryColumns, countryFilters, Country } from './Config'


type CountriesApi = ApiResponse<Country[], 'countries'> | { data: Country[] }

const Countries = ({ data }: { data: CountriesApi }) => {
  const { t } = useTranslation()

  const rows = Array.isArray((data as any).data?.countries)
    ? (data as any).data.countries
    : (data as any).data

  const customToolbar = (
    <Link to="/settings/countries/add">
      <Button size="sm">{t ? t('Add Country') : 'Add Country'}</Button>
    </Link>
  )

  return (
    <DataTable
        data={rows}
        columns={countryColumns()}
        searchKey="search"
        filters={countryFilters}
        pagination={false}
        meta={(data as any).data?.meta}
        initialState={{
            pagination: {
            pageIndex: ((data as any).data?.meta?.current_page || 1) - 1,
            pageSize: (data as any).data?.meta?.per_page || 10,
            },
        }}
        toolbar={customToolbar}
        resizable
        enableUrlState
        exports={{ name: 'countries' }}
    />
  )
}

export default Countries
