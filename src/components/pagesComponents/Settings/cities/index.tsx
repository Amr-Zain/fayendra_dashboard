import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import {
  DataTable,
} from '@/components/common/table/AppTable'
import { RowActions } from '@/components/common/table/RowActions'
import { Link, useSearch } from '@tanstack/react-router'
import { City } from '@/types/api/country'
import { useStatusMutation } from '@/hooks/useStatusMutations'
import { useState } from 'react'
import ConfirmModal from '@/components/common/uiComponents/ConfirmModal'
import { actions, cityColumns, filters } from './config'
import { citiesQueryKeys } from '@/util/queryKeysFactory'


const Cities = ({ data }: { data: ApiResponse<City[],'cities'> }) => {
  const { t } = useTranslation()
  const [openModal, setModal] = useState<{
      type: 'active' | 'delete'
      show: boolean
      id: string
    }>({
      show: false,
      type: 'active',
      id: '',
    })
      const search = useSearch({ from: '/_main/settings/cities/' })
    
    const { mutateAsync: ChangeActiveMutate, isPending: activeLoading } =
      useStatusMutation(
        openModal.id,
        'active',
        'cities',
        citiesQueryKeys.getCity(openModal.id),
        [citiesQueryKeys.filterd(search)],
      )
    
    const { mutateAsync: ChangeDeleteMutate, isPending: deleteLoading } =
      useStatusMutation(
        openModal.id,
        'delete',
        'cities',
        citiesQueryKeys.getCity(openModal.id),
        [citiesQueryKeys.filterd(search)],
      )
  const handleConfirm = async () => {
    if (openModal.type === 'active') await ChangeActiveMutate({ is_active: !data.data.cities.find(city=>+openModal.id === city.id)?.is_active })
    if (openModal.type === 'delete') await ChangeDeleteMutate({})
  }

const customToolbar = (
  <Link to="/settings/cities/add">
    <Button size="sm">Add City</Button>
  </Link>
)


  const modalTitle = {
    active: 'Toggle city Active Status',
    delete: 'Delete city',
  }

  const modalDesc = {
    active: 'Are you sure you want to change the active status of this city?',
    delete:
      'Are you sure you want to delete this city permanently? This action cannot be undone.',
  }


  return (
    <>
      <DataTable
        data={data.data.cities}
        columns={cityColumns(setModal)}
        searchKey="search"
        filters={filters}
        pagination={true}
        meta={data.data.meta!}
        /* selectable={true} */
        actions={RowActions({
          actions: actions(setModal),
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
        exports={{
          name: 'users',
          // endpoint:""
        }}
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

export default Cities
