import { useTranslation } from 'react-i18next'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import MainPageWrapper from '@/components/layout/MainPageWrapper'
import ProfileCard from './ProfileCard'
import EditProfileForm from './EditProfile'
import ChangePasswordForm from './ChangePassword'
import { useAuthStore } from '@/stores/authStore'
import { ContactRound, Home } from 'lucide-react'
import ProfileSettings from './ProfileSettings'

export default function Profile() {
  const { t } = useTranslation()
  const profile = useAuthStore((state) => state.user)!

  const breadcrumbItems = [
    { icon: <Home />, label: t('pages.home'), to: '/' },
    { icon: <ContactRound />, label: t('profile.title') },
  ]

  const initialValues = {
    full_name: profile.name,
    email: profile.email,
    phone: profile.phone,
    phone_code: profile.phone_code,
    image: profile.image,
  }

  return (
    <MainPageWrapper breadcrumbItems={breadcrumbItems}>
      <div className="@container w-full">
        <Tabs defaultValue="edit-profile" className="w-full">
          <TabsList className="hidden @[750px]:flex w-full justify-start gap-2 overflow-x-auto mb-4">
            <TabsTrigger
              value="edit-profile"
              className="whitespace-nowrap cursor-pointer"
            >
              {t('tabs.editProfile')}
            </TabsTrigger>
            <TabsTrigger value="change-password" className="whitespace-nowrap">
              {t('tabs.changePassword')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="whitespace-nowrap">
              {t('tabs.settings')}
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 @[750px]:grid-cols-[350px_1fr] gap-4 ">
            <ProfileCard />
            <div className="min-h-[80vh]">
              <TabsList className="flex @[750px]:hidden w-full justify-start gap-2 overflow-x-auto mb-4">
                <TabsTrigger
                  value="edit-profile"
                  className="whitespace-nowrap cursor-pointer"
                >
                  {t('tabs.editProfile')}
                </TabsTrigger>
                <TabsTrigger
                  value="change-password"
                  className="whitespace-nowrap"
                >
                  {t('tabs.changePassword')}
                </TabsTrigger>
                <TabsTrigger value="settings" className="whitespace-nowrap">
                  {t('tabs.settings')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit-profile" className="m-0">
                <EditProfileForm initialValues={initialValues} />
              </TabsContent>

              <TabsContent value="change-password" className="m-0">
                <ChangePasswordForm />
              </TabsContent>
              <TabsContent value="settings" className="m-0">
                <ProfileSettings />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </MainPageWrapper>
  )
}
