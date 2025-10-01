import { ApiResponse } from '@/types/api/http'
import { User } from '@/types/api/user'
import { useTranslation } from 'react-i18next'
import { useMutate } from './UseMutate'
import { toast } from 'sonner'
import { citiesQueryKeys } from '@/util/queryKeysFactory'
import { useSearch } from '@tanstack/react-router'

export const useCityMutation = (
  id: string,
  type: 'active'  | 'delete',
) => {
  const { t } = useTranslation()

  const mutationMapping = {
    active: {
      mutationKey: citiesQueryKeys.getCity(id),
      endpoint: `cities/${id}`,
      method: 'put',
      successMessage: t('status_changed_successfully'),
    },
    delete: {
      mutationKey: citiesQueryKeys.getCity(id),
      endpoint: `cities/${id}`,
      method: 'delete',
      successMessage: t('user_deleted_successfully'),
    },
  } as const
  const search = useSearch({ from: '/_main/settings/cities/' })
  const { mutateAsync, isPending } = useMutate<ApiResponse<User>>({
    mutationKey: [mutationMapping[type].mutationKey],
    endpoint: mutationMapping[type].endpoint,
    method: mutationMapping[type].method,
    mutationOptions: {
      meta: { invalidates: [citiesQueryKeys.filterd(search)] },
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
