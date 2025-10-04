import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { RowActions } from '@/components/common/table/RowActions'
import { Link, useSearch } from '@tanstack/react-router'
import { City } from '@/types/api/country'
import { useStatusMutation } from '@/hooks/useStatusMutations'
import { useState, useEffect } from 'react'
import { actions, cityColumns, filters } from './config'
import { citiesQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'

const Cities = ({ data }: { data: ApiResponse<City[], 'cities'> }) => {
  const { t } = useTranslation()
  const alert = useAlertModal()
  const search = useSearch({ from: '/_main/settings/cities/' })

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
      'cities',
      citiesQueryKeys.getCity(currentId),
      [citiesQueryKeys.filterd(search)],
    )

  const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
    useStatusMutation(
      currentId,
      'delete',
      'cities',
      citiesQueryKeys.getCity(currentId),
      [citiesQueryKeys.filterd(search)],
    )

  // ✅ Sync the global alert's pending state
  useEffect(() => {
    alert.setPending(activePending || deletePending)
  }, [activePending, deletePending])

  const modalTitle = {
    active: 'Toggle city Active Status',
    delete: 'Delete city',
  }

  const modalDesc = {
    active: 'Are you sure you want to change the active status of this city?',
    delete:
      'Are you sure you want to delete this city permanently? This action cannot be undone.',
  }

  // ✅ openAlert takes the row (City) now
  const openAlert = (type: 'active' | 'delete', row: City) => {
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
    <Link to="/settings/cities/add">
      <Button size="sm">{t ? t('Add City') : 'Add City'}</Button>
    </Link>
  )

  return (
      <DataTable
        data={data.data.cities}
        columns={cityColumns(openAlert)}   
        searchKey="search"
        filters={filters}
        pagination
        meta={data.data.meta!}
        actions={RowActions({
          actions: actions(openAlert),   
          menuLabel: 'Actions',
        })}
        toolbar={customToolbar}
        initialState={{
          pagination: {
            pageIndex: data.data.meta!.current_page - 1 || 0,
            pageSize: data.data.meta!.per_page || 10,
          },
        }}
        resizable
        enableUrlState
      />
  )
}

export default Cities
