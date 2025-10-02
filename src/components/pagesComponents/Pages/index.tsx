import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { Link, useSearch } from '@tanstack/react-router'
import { RowActions } from '@/components/common/table/RowActions'
import { useState } from 'react'
import ConfirmModal from '@/components/common/uiComponents/ConfirmModal'
import { useStatusMutation } from '@/hooks/useStatusMutations'
import {
  staticPagesColumns,
  StaticPage,
  actions as pageActions,
} from './Config'
import { pagesQueryKeys } from '@/util/queryKeysFactory'

type StaticPagesApi =
  | ApiResponse<{ static_pages: StaticPage[]; meta: any }, 'static_pages'>
  | {
      data: {
        static_pages: StaticPage[]
        meta?: any
      }
    }

const StaticPages = ({ data }: { data: StaticPagesApi }) => {
  const { t } = useTranslation()

  const rows = ((data as any).data?.static_pages || []) as StaticPage[]
  const meta = (data as any).data?.meta

  const [openModal, setModal] = useState<{
    type: 'active' | 'delete'
    show: boolean
    id: string
  }>({
    show: false,
    type: 'active',
    id: '',
  })

  const search = useSearch({ from: '/_main/pages/' })

  const { mutateAsync: ChangeActiveMutate, isPending: activeLoading } =
    useStatusMutation(
      openModal.id,
      'active',
      'static-pages',
      pagesQueryKeys.getPage(openModal.id),
      [pagesQueryKeys.filterd(search)],
    )

  const { mutateAsync: ChangeDeleteMutate, isPending: deleteLoading } =
    useStatusMutation(
      openModal.id,
      'delete',
      'static-pages',
      pagesQueryKeys.getPage(openModal.id),
      [pagesQueryKeys.filterd(search)],
    )

  const handleConfirm = async () => {
    if (openModal.type === 'active') {
      const current = rows.find((r) => +openModal.id === r.id)?.is_active
      await ChangeActiveMutate({ is_active: !current })
    }
    if (openModal.type === 'delete') {
      await ChangeDeleteMutate({})
    }
    setModal((p) => ({ ...p, show: false }))
  }

  const modalTitle = {
    active: 'Toggle Page Active Status',
    delete: 'Delete Page',
  }

  const modalDesc = {
    active: 'Are you sure you want to change the active status of this page?',
    delete:
      'Are you sure you want to delete this page permanently? This action cannot be undone.',
  }

  const customToolbar = (
    <Link to="/pages/add">
      <Button size="sm">{t ? t('Add Page') : 'Add Page'}</Button>
    </Link>
  )

  return (
    <>
      <DataTable
        data={rows}
        columns={staticPagesColumns(setModal)}
        searchKey="search"
        pagination
        meta={meta}
        initialState={{
          pagination: {
            pageIndex: ((meta?.current_page || 1) - 1) as number,
            pageSize: (meta?.per_page || 15) as number,
          },
        }}
        actions={RowActions({
          actions: pageActions(setModal, pagesQueryKeys),
          menuLabel: 'Actions',
        })}
        toolbar={customToolbar}
        resizable
        enableUrlState
        exports={{ name: 'static-pages' }}
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

export default StaticPages
