import { ApiResponse } from "@/types/api/http"
import { User } from "@/types/api/user"
import { useTranslation } from "react-i18next"
import { useMutate } from "./UseMutate"
import { toast } from "sonner"
import { usersQueryKeys } from "@/util/queryKeysFactory"
import { useSearch } from "@tanstack/react-router"


export const useStatusMutation = (id: string, type: 'active' | 'ban' | 'delete') => {
  const { t } = useTranslation()

  const mutationMapping = {
    active: {
      mutationKey: usersQueryKeys.getUser(id),
      endpoint: `users/${id}/toggle-active-user`,
      method: 'patch',
      successMessage: t('status_changed_successfully'),
    },
    ban: {
      mutationKey: usersQueryKeys.getUser(id),
      endpoint: `users/${id}/toggle-ban-user`,
      method: 'patch',
      successMessage: t('status_changed_successfully'),
    },
    delete: {
      mutationKey: usersQueryKeys.getUser(id),
      endpoint: `users/${id}`,
      method: 'delete',
      successMessage: t('user_deleted_successfully'),
    },
  } as const
  const search = useSearch({from:'/_main/users/'});
  const { mutateAsync, isPending } = useMutate<ApiResponse<User>>({
    mutationKey: [mutationMapping[type].mutationKey],
    endpoint: mutationMapping[type].endpoint,
    method: mutationMapping[type].method,
    mutationOptions: {
      meta: { invalidates: [usersQueryKeys.usersFilterd(search)] },
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
