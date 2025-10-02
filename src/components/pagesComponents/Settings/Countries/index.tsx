import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { Link, useSearch } from '@tanstack/react-router'
import { countryColumns, countryFilters, Country, actions } from './Config'
import { RowActions } from '@/components/common/table/RowActions'
import { useState } from 'react'
import { countriesQueryKeys } from '@/util/queryKeysFactory'
import { useStatusMutation } from '@/hooks/useStatusMutations'
import ConfirmModal from '@/components/common/uiComponents/ConfirmModal'


type CountriesApi = ApiResponse<Country[], 'countries'> | { data: Country[] }

const Countries = ({ data }: { data: CountriesApi }) => {
  const { t } = useTranslation()

  const rows = (
    Array.isArray((data as any).data?.countries)
      ? (data as any).data.countries
      : (data as any).data
  ) as Country[]
  const [openModal, setModal] = useState<{
        type: 'active' | 'delete'
        show: boolean
        id: string
      }>({
        show: false,
        type: 'active',
        id: '',
      })
        const search = useSearch({ from: '/_main/settings/countries/' })
      
      const { mutateAsync: ChangeActiveMutate, isPending: activeLoading } =
        useStatusMutation(
          openModal.id,
          'active',
          'countries',
          countriesQueryKeys.getCountry(openModal.id),
          [countriesQueryKeys.filterd(search)],
        )
      
      const { mutateAsync: ChangeDeleteMutate, isPending: deleteLoading } =
        useStatusMutation(
          openModal.id,
          'delete',
          'countries',
          countriesQueryKeys.getCountry(openModal.id),
          [countriesQueryKeys.filterd(search)],
        )
    const handleConfirm = async () => {
      if (openModal.type === 'active') await ChangeActiveMutate({
        is_active: !rows.find((countries) => +openModal.id === countries.id)
          ?.is_active,
      })
      if (openModal.type === 'delete') await ChangeDeleteMutate({})
    }
  
 
  
  
    const modalTitle = {
      active: 'Toggle Country Active Status',
      delete: 'Delete Country',
    }
  
    const modalDesc = {
      active: 'Are you sure you want to change the active status of this Country?',
      delete:
        'Are you sure you want to delete this Country permanently? This action cannot be undone.',
    }
  
  const customToolbar = (
    <Link to="/settings/countries/add">
      <Button size="sm">{t ? t('Add Country') : 'Add Country'}</Button>
    </Link>
  )

  return (
    <>
      <DataTable
        data={rows}
        columns={countryColumns(setModal)}
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
        actions={RowActions({
          actions: actions(setModal),
          menuLabel: 'Actions',
        })}
        toolbar={customToolbar}
        resizable
        enableUrlState
        exports={{ name: 'countries' }}
      />
      <ConfirmModal
        title={modalTitle[openModal.type]}
        desc={modalDesc[openModal.type]}
        open={openModal.show}
        setOpen={(show) => setModal((prev) => ({ ...prev, show }))}
        onClick={handleConfirm}
        Pending={activeLoading || deleteLoading}
        variant={openModal.type !== 'delete' ? 'default' : 'destructive'}
      />
    </>
  )
}

export default Countries
