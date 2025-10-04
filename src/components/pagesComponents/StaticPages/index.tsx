import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '@/types/api/http'
import { DataTable } from '@/components/common/table/AppTable'
import { Link, useSearch } from '@tanstack/react-router'
import { RowActions } from '@/components/common/table/RowActions'
import { useState, useEffect } from 'react'
import { useStatusMutation } from '@/hooks/useStatusMutations'
import {
  staticPagesColumns,
  StaticPage,
  actions as pageActions,
} from './Config'
import { pagesQueryKeys } from '@/util/queryKeysFactory'
import { useAlertModal } from '@/stores/useAlertModal'



const StaticPages = ({ data }: { data: ApiResponse<StaticPage[], 'static_pages'> }) => {
  const { t } = useTranslation()
  const alert = useAlertModal()

  const rows = ((data as any).data?.static_pages || []) as StaticPage[]
  const meta = (data as any).data?.meta
  const search = useSearch({ from: '/_main/static-pages/' })

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
      'static-pages',
      pagesQueryKeys.getPage(currentId),
      [pagesQueryKeys.filterd(search)],
    )

  const { mutateAsync: ChangeDeleteMutate, isPending: deletePending } =
    useStatusMutation(
      currentId,
      'delete',
      'static-pages',
      pagesQueryKeys.getPage(currentId),
      [pagesQueryKeys.filterd(search)],
    )

  useEffect(() => {
    alert.setPending(activePending || deletePending)
  }, [activePending, deletePending])

  const modalTitle = {
    active: 'Toggle Page Active Status',
    delete: 'Delete Page',
  } as const

  const modalDesc = {
    active: 'Are you sure you want to change the active status of this page?',
    delete:
      'Are you sure you want to delete this page permanently? This action cannot be undone.',
  } as const

  const openAlert = (type: 'active' | 'delete', row: StaticPage) => {
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
    <Link to="/static-pages/add">
      <Button size="sm">{t ? t('Add Page') : 'Add Page'}</Button>
    </Link>
  )

  return (
      <DataTable
        data={rows}
        columns={staticPagesColumns(openAlert)}
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
          actions: pageActions(openAlert),
          menuLabel: 'Actions',
        })}
        toolbar={customToolbar}
        resizable
        enableUrlState
      />
  )
}

export default StaticPages
