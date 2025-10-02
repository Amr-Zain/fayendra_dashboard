import { ApiResponse } from '@/types/api/http'
import { User } from '@/types/api/user'
import { useTranslation } from 'react-i18next'
import { useMutate } from './UseMutate'
import { toast } from 'sonner'
import { QueryKey } from '@tanstack/react-query'

export const useStatusMutation = (
  id: string,
  type: 'active' | 'delete',
  endpoint: string,
  mutationKey: QueryKey,
  invalidates: QueryKey[],
) => {
  const { t } = useTranslation()

  const mutationMapping = {
    active: {
      mutationKey,
      endpoint: `${endpoint}/${id}`,
      method: 'put',
      successMessage: t('status_changed_successfully'),
    },
    delete: {
      mutationKey,
      endpoint: `${endpoint}/${id}`,
      method: 'delete',
      successMessage: t('deleted_successfully'),
    },
  } as const
  const { mutateAsync, isPending } = useMutate<ApiResponse<User>>({
    mutationKey: [mutationMapping[type].mutationKey],
    endpoint: mutationMapping[type].endpoint,
    method: mutationMapping[type].method,
    mutationOptions: {
      meta: { invalidates: invalidates },
    },
    onSuccess: (data) => {
      toast.success(data.message || mutationMapping[type].successMessage)
    },
    onError: (_err, normalized) => {
      toast.error(normalized.message)
    },
  })

  return { mutateAsync, isPending }
}
