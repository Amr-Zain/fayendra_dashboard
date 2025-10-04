import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'

export default function ProfileCard() {
  const { t } = useTranslation()
  const { name: full_name, email, image, phone } = useAuthStore(
    (state) => state.user!
  )

  const initials = useMemo(() => {
    const name = full_name?.trim()
    if (!name) return 'A'
    return name
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }, [full_name])

  const personalInfo = [
    { label: t('labels.full_name'), value: full_name },
    { label: t('labels.email'), value: email },
    { label: t('labels.phone'), value: phone },
  ]

  return (
    <Card className="rounded-3xl overflow-hidden border-primary/20 max-h-fit">
      <CardHeader className="flex items-center gap-4 pb-0">
        <Avatar className="w-20 h-20 ring-1 ring-primary/20">
          <AvatarImage src={image ?? ''} alt={full_name ?? 'Profile'} />
          <AvatarFallback className="bg-gradient-primary text-white text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{full_name}</CardTitle>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">
          {t('labels.personal_info')}
        </h3>
        <div className="space-y-3">
          {personalInfo.map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="w-32 text-sm font-medium text-muted-foreground">
                {row.label}
              </span>
              {row.value ? (
                <span className="text-sm">: {row.value}</span>
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
