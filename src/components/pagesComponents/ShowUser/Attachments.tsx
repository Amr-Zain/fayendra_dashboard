import { ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DriverDocument {
  car_license?: string;
  car_license_back?: string;
  car_check?: string;
  driver_license?: string;
  driver_license_back?: string;
  national_id?: string;
  national_id_back?: string;
  criminal_record?: string;
}

interface AttachmentsProps {
  driver: DriverDocument;
}

export const Attachments = ({ driver }: AttachmentsProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-primary to-primary-second size-9 flex items-center justify-center rounded-xl">
            <ImageIcon className="size-6 text-white" />
          </span>
          {t("labels.documents_attachments")}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: t("fields.car_license"),
              url: driver?.car_license,
            },
            {
              label: t("fields.car_license_back"),
              url: driver?.car_license_back,
            },
            {
              label: t("fields.car_check"),
              url: driver?.car_check,
            },
            {
              label: t("fields.driver_license"),
              url: driver?.driver_license,
            },
            {
              label: t("fields.driver_license_back"),
              url: driver?.driver_license_back,
            },
            {
              label: t("fields.national_id"),
              url: driver?.national_id,
            },
            {
              label: t("fields.national_id_back"),
              url: driver?.national_id_back,
            },
            {
              label: t("fields.criminal_record"),
              url: driver?.criminal_record,
            },
          ].map((doc, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-center mb-2">
                  {doc.label}
                </p>
                <div className="h-[160px] rounded-lg overflow-hidden">
                  {doc.url ? (
                    <img
                      src={doc.url}
                      alt={doc.label}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer rounded-lg"
                      onClick={() => window.open(doc.url, "_blank")}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full bg-muted rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground text-center">
                        {t("not_found")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};