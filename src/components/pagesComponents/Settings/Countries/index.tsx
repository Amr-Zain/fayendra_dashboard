import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { Link, useSearch } from '@tanstack/react-router'
import { countryColumns, countryFilters, actions } from './Config'
import { RowActions } from '@/components/common/table/RowActions'
import { useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { countriesQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'
import { CountryDetails } from '@/types/api/country'

type CountriesApi = ApiResponse<CountryDetails[], 'countries'> | { data: CountryDetails[] }

const Countries = ({ data }: { data: CountriesApi }) => {
  const { t } = useTranslation()
  const alert = useAlertModal()
  const search = useSearch({ from: '/_main/settings/countries/' })

  const rows = (
    Array.isArray((data as any).data?.countries)
      ? (data as any).data.countries
      : (data as any).data
  ) as CountryDetails[]

  const [selected, setSelected] = useState<{
    id: string
    type: 'active' | 'delete'
    isActive?: boolean
  } | null>(null)

  const currentId = selected?.id || ''

  const { mutateAsync: ChangeActiveMutate, isPending: activePending } =
    useStatusMutation(
      currentId,
      'active',
      'countries',
      countriesQueryKeys.getCountry(currentId),
      [countriesQueryKeys.filterd(search)],
    )

  const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
    useStatusMutation(
      currentId,
      'delete',
      'countries',
      countriesQueryKeys.getCountry(currentId),
      [countriesQueryKeys.filterd(search)],
    )

  useEffect(() => {
    alert.setPending(activePending || deletePending)
  }, [activePending, deletePending])

  const modalTitle = {
    active: 'Toggle Country Active Status',
    delete: 'Delete Country',
  }

  const modalDesc = {
    active: 'Are you sure you want to change the active status of this Country?',
    delete:
      'Are you sure you want to delete this Country permanently? This action cannot be undone.',
  }

  const openAlert = (type: 'active' | 'delete', row: CountryDetails) => {
    setSelected({ id: row.id.toString(), type, isActive: row.is_active })

    const handler = async () => {
      if (type === 'active') {
        await ChangeActiveMutate({ is_active: !row.is_active })
      } else {
        await ChangeDeleteMutate({})
      }
      alert.setIsOpen(false)
    }

    alert.setModel({
      isOpen: true,
      variant: type === 'delete' ? 'destructive' : 'default',
      title: modalTitle[type],
      desc: modalDesc[type],
      pending: activePending || deletePending,
      handleConfirm: handler,
    })
    alert.setHandler(handler)
  }

  const customToolbar = (
    <Link to="/settings/countries/add">
      <Button size="sm">{t ? t('Add Country') : 'Add Country'}</Button>
    </Link>
  )

  return (
    <DataTable
      data={rows}
      columns={countryColumns(openAlert)}
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
        actions: actions(openAlert),
        menuLabel: 'Actions',
      })}
      toolbar={customToolbar}
      resizable
      enableUrlState
      exports={{ name: 'countries' }}
    />
  )
}

export default Countries
