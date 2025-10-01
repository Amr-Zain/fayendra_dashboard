import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'

function ConfirmModal({
  title,
  desc,
  open,
  setOpen,
  onClick,
  Pending,
  variant = 'destructive', 
}: {
  title: string
  desc: string
  open: boolean
  setOpen: (value: boolean) => void
  onClick: () => Promise<void>
  Pending: boolean
  variant?: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' 
}) {
  const { t } = useTranslation()

  const handleConfirm = async () => {
    await onClick()
    setOpen(false)
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-2xl border-0 px-4 shadow-xl [&>button:last-child]:hidden">
        <AlertDialogHeader className="pb-4">
          <AlertDialogTitle className="text-text text-center text-xl font-semibold">
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-sub">
          {desc}
        </AlertDialogDescription>
        <div className="flex w-full justify-end gap-4 px-4">
          <AlertDialogCancel asChild>
            <Button
              variant="ghost"
              className="!h-10 cursor-pointer"
              disabled={Pending}
              onClick={() => setOpen(false)}
            >
              {t('buttons.cancel')}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ variant })} asChild>
            <Button
              onClick={handleConfirm}
              className="!h-10 cursor-pointer rounded-xl px-6"
              disabled={Pending}
              variant={variant}
            >
              {Pending ? (
                <div className="relative w-6 h-6 flex items-center justify-center">
                  loading ...
                </div>
              ) : (
                t('buttons.confirm')
              )}
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmModal
