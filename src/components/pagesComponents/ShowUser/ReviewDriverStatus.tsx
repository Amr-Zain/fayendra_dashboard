import { useMutate } from '@/hooks/UseMutate'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api/http'
import { useState } from 'react'
import ConfirmModal from '@/components/common/uiComponents/ConfirmModal'
import { usersQueryKeys } from '@/util/queryKeysFactory'

type DriverStatus = 'pending' | 'accepted' | 'rejected'

interface ReviewDriverStatusProps {
  id: string
  status?: DriverStatus
}

export const ReviewDriverStatus = ({ status, id }: ReviewDriverStatusProps) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<'accepted' | 'rejected'>()

  const { mutateAsync, isPending: isMutating } = useMutate<ApiResponse>({
    mutationKey: [usersQueryKeys.getUser(id)],
    endpoint: `users/${id}/change-status`,
    mutationOptions: {
      meta: { invalidates: [usersQueryKeys.getUser(id)] },
    },
    onSuccess: async (data) => {
      toast.success(data?.message || t('toast.edit_success'))
    },
    onError: async (_err, nrmalize) => {
      toast.error(nrmalize?.message || t('messages.somethingWrong'))
    },
    formData: true,
    method: 'post',
  })

  const handleChangeStatus = (nextStatus: 'accepted' | 'rejected') => {
    setPendingStatus(nextStatus)
    setIsModalOpen(true)
  }

  const handleConfirmStatusChange = async () => {
    if (pendingStatus) {
      await mutateAsync({ status: pendingStatus })
    }
  }

  const handleToggleAcceptedRejected = () => {
    const nextStatus = status === 'rejected' ? 'accepted' : 'rejected'
    handleChangeStatus(nextStatus)
  }

  return (
    <>
      {status === 'pending' && (
        <Card className="border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-amber-900">
                    {t('messages.user_pending_review')}
                  </h3>
                  <p className="text-sm text-amber-800">
                    {t('messages.user_pending_review_desc')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isMutating}
                  onClick={() => handleChangeStatus('accepted')}
                >
                  {t('buttons.accept')}
                </Button>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-400"
                  disabled={isMutating}
                  onClick={() => handleChangeStatus('rejected')}
                >
                  {t('buttons.reject')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!!status && status !== 'pending' && (
        <Button
          variant="outline"
          onClick={handleToggleAcceptedRejected}
          disabled={isMutating}
        >
          {t('messages.change_status')}
        </Button>
      )}

      <ConfirmModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title={t('messages.change_status')}
        desc={
          pendingStatus === 'accepted'
            ? t('messages.accept_user_desc')
            : t('messages.reject_user_desc')
        }
        onClick={handleConfirmStatusChange}
        Pending={isMutating}
      />
    </>
  )
}
