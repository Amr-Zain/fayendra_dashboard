import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import ImageFallback from "@/components/common/uiComponents/image/ImageFullback";
import { User } from "@/types/api/user";

type UserStatus = "rejected" | "accepted" | "pending";
type UserType = "client" | "driver";


interface ProfileCardProps {
  user: User;
  status?: UserStatus;
}
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "rejected":
      return "destructive";
    case "accepted":
      return "default";
    case "pending":
      return "secondary";
    default:
      return "outline";
  }
};

const ProfileCard = ({ user, status }: ProfileCardProps) => {
  const { t } = useTranslation();
  

  const profileData = [
    {
      label: t("labels.phone"),
      value: "+" + user?.phone_complete_form,
    },
    {
      label: t("labels.email"),
      value: user?.email || "N/A",
    },
    {
      label: t("labels.gender"),
      value: user?.gender,
    },
    {
      label: t("labels.balance"),
      value: `${user?.balance} ${t("labels.currency")}`,
    },
    {
      label: t("labels.user_type"),
      value: t(`labels.${user?.user_type}`),
    },
    {
      label: t("labels.created_at"),
      value: user?.created_at,
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-pink-500 to-rose-600 size-9 flex items-center justify-center rounded-xl">
              <Users className="size-6 text-white" />
            </span>
            {t(status ? "labels.driver_info" : "labels.user_info")}
          </CardTitle>
          {status && (
            <Badge variant={getStatusBadgeVariant(status)}>
              {t(`labels.${status}`)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center p-6 mb-6">
          <ImageFallback
            src={user?.image}
            alt={user?.full_name}
            className="size-40 rounded-full object-cover mb-4 border border-border p-1 shadow-sm"
          />
          <h6 className="font-semibold text-lg">{user?.full_name}</h6>
          <p className="text-sm text-muted-foreground">{t(`labels.${user?.user_type}`)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {profileData.map((item, index) => (
            <Card key={index} className="border-muted">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="font-medium">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-muted">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("labels.is_active")}
              </p>
              <Badge 
                variant={user?.is_admin_active_user ? "default" : "destructive"}
                className="text-xs"
              >
                {user?.is_admin_active_user
                  ? t("labels.active")
                  : t("labels.inactive")}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-muted">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("labels.is_banned")}
              </p>
              <Badge 
                variant={user?.is_ban ? "destructive" : "default"}
                className="text-xs"
              >
                {user?.is_ban ? t("labels.banned") : t("labels.not_banned")}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-muted">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("labels.notifications")}
              </p>
              <Badge 
                variant={user?.allow_notifications ? "default" : "destructive"}
                className="text-xs"
              >
                {user?.allow_notifications
                  ? t("labels.allowed")
                  : t("labels.blocked")}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;