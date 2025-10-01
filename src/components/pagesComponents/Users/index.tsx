import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/common/uiComponents/ConfirmModal'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { User } from '@/types/api/user'
import {
  DataTable,
} from '@/components/common/table/AppTable'
import { RowActions } from '@/components/common/table/RowActions'
import { Link } from '@tanstack/react-router'
import { useStatusMutation } from '@/hooks/useUserMutation'
import { filters, userColumns, actions } from './tableConfig'


const Users = ({ data }: { data: ApiResponse<User[]> }) => {
  const { t } = useTranslation()
  const [openModal, setModal] = useState<{
    type: 'active' | 'ban' | 'delete'
    show: boolean
    id: string
  }>({
    show: false,
    type: 'active',
    id: '',
  })

  const customToolbar = (
      <Link to="/users/add">
        <Button size="sm">Add User</Button>
      </Link>
    
  )



  const { mutateAsync: ChangeActiveMutate, isPending: activeLoading } =
    useStatusMutation(openModal.id, 'active')
  const { mutateAsync: ChangeBanMutate, isPending: banLoading } =
    useStatusMutation(openModal.id, 'ban')
  const { mutateAsync: ChangeDeleteMutate, isPending: deleteLoading } =
    useStatusMutation(openModal.id, 'delete')

  const handleConfirm = async () => {
    if (openModal.type === 'active') await ChangeActiveMutate({})
    if (openModal.type === 'ban') await ChangeBanMutate({})
    if (openModal.type === 'delete') await ChangeDeleteMutate({})
  }

  const modalTitle = {
    active: 'Toggle User Active Status',
    ban: 'Toggle User Ban Status',
    delete: 'Delete User',
  }

  const modalDesc = {
    active: 'Are you sure you want to change the active status of this user?',
    ban: 'Are you sure you want to ban/unban this user?',
    delete:
      'Are you sure you want to delete this user permanently? This action cannot be undone.',
  }

  return (
    <>
      <DataTable
        data={data.data}
        columns={userColumns(setModal)}
        searchKey="keyword"
        filters={filters}
        pagination={true}
        meta={data.meta!}
        selectable={true}
        actions={RowActions({ actions:actions(setModal), menuLabel: 'Actions' })}
        toolbar={customToolbar}
        initialState={{
          pagination: {
            pageIndex: data.meta!.current_page - 1 || 0,
            pageSize: data.meta!.per_page || 10,
          },
        }}
        resizable
        enableUrlState
        exports={{
          name:'users',
          // endpoint:""
        }}
      />
      <ConfirmModal
        title={modalTitle[openModal.type]}
        desc={modalDesc[openModal.type]}
        open={openModal.show}
        setOpen={(show) => setModal((prev) => ({ ...prev, show }))}
        onClick={handleConfirm}
        Pending={activeLoading || banLoading || deleteLoading}
        variant={openModal.type !=='delete'?"default":'destructive'}
      />
    </>
  )
}

export default Users
