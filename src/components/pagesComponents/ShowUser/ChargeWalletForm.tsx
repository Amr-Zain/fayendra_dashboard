import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useMutate } from '@/hooks/UseMutate'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'
import * as z from 'zod'
import AppForm from '@/components/common/form/AppForm'
import { FieldProp } from '@/types/components/form'
import { ApiResponse } from '@/types/api/http'
import { tranactionsQueryKeys, usersQueryKeys } from '@/util/queryKeysFactory'
import { Transaction } from '@/types/api/user'




const formSchema = z.object({
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
    })
    .min(1, 'Amount must be greater than 0')
    .max(10000, 'Amount cannot exceed 10,000'),
  type: z.enum(['charge', 'withdrawal'], {
    required_error: 'Type is required',
  }),
})

type FormData = z.infer<typeof formSchema>

export default function ChargeWalletForm({ id }: { id: string}) {
  const endpoint = `charge-wallet/${id}`
  const { t } = useTranslation()

  const { mutate, isPending } = useMutate<ApiResponse<{
      balance: number
      transactions: Transaction[]
    }>>({
    mutationKey: [endpoint],
    endpoint,
    mutationOptions:{
      meta: { invalidates: [usersQueryKeys.getUser(id), tranactionsQueryKeys.all(id)]}
    },
    onSuccess: (data) => {
      toast.success(data.message || t('toast.success'))
      // Refetch transactions and user data
      // queryClient.refetchQueries({
      //   queryKey: [`transactions/${id}`],
      // })
      // queryClient.refetchQueries({
      //   queryKey: [`users/${id}`],
      // })
    },

    onError: (_err, normalizedError) => {
      const errorMessage =
       normalizedError?.message ||
        t('messages.somethingWrong')
      toast.error(errorMessage)
    },
    formData: true,
    method: 'post',
  })

  const fields: FieldProp<FormData>[] = [
    {
      type: 'text',
      name: 'amount',
      label: t('labels.amount'),
      placeholder: t('labels.amount'),
      span: 1,
      inputProps: {
        min: 1,
        max: 10000,
      },
      control: {} as any,
    },
    {
      type: 'select',
      name: 'type',
      label: t('labels.type'),
      span: 1,
      inputProps: {
        options: [
          { label: t('labels.charge'), value: 'charge' },
          { label: t('labels.withdrawal'), value: 'withdrawal' },
        ],
        placeholder: t('labels.select_transaction_type'),
      },
      control: {} as any,
    },
  ]

  const onSubmit = (values: FormData) => {
    mutate(values)
  }

  const defaultValues: FormData = {
    amount: 0,
    type: 'charge',
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 size-9 flex items-center justify-center rounded-xl">
            <CreditCard className="size-5 text-white" />
          </span>
          {t('labels.charge_wallet')}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <AppForm
          schema={formSchema}
          fields={fields}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isLoading={isPending}
          spacing="md"
          gridColumns={1}
        />
      </CardContent>
    </Card>
  )
}
