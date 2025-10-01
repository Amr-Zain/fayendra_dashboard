import { Car } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CarData {
  car_image?: string;
  car_brand?: string;
  car_model?: string;
  car_color?: string;
  car_year?: string;
  car_letter_ar?: string;
  car_number_ar?: string;
}

interface CarInfoProps {
  driver: CarData;
}

export const CarInfo = ({ driver }: CarInfoProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className={`${driver ? "" : "lg:col-span-4"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-yellow-500 to-orange-600 size-9 flex items-center justify-center rounded-xl">
            <Car className="size-6 text-white" />
          </span>
          {t("labels.car_info")}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <Card className="p-6">
              <CardContent className="p-0">
                <img
                  src={driver?.car_image}
                  alt={`${driver?.car_brand} ${driver?.car_model}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4 lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-primary/20">
                <CardContent className="p-4 text-primary">
                  <p className="text-sm mb-1">{t("labels.brand")}</p>
                  <p className="font-semibold">{driver?.car_brand}</p>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="p-4 text-primary">
                  <p className="text-sm mb-1">{t("labels.model")}</p>
                  <p className="font-semibold">{driver?.car_model}</p>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="p-4 text-primary">
                  <p className="text-sm mb-1">{t("labels.color")}</p>
                  <p className="font-semibold">{driver?.car_color}</p>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="p-4 text-primary">
                  <p className="text-sm mb-1">{t("labels.year")}</p>
                  <p className="font-semibold">{driver?.car_year}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-primary/20">
              <CardContent className="p-4 text-primary">
                <p className="text-sm mb-2">{t("labels.license_plate")}</p>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className="bg-background px-3 py-2 border-border shadow-sm"
                  >
                    <span className="font-bold text-red-500">
                      {driver?.car_letter_ar}
                    </span>
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-background px-3 py-2 border-border shadow-sm"
                  >
                    <span className="font-bold text-red-500">
                      {driver?.car_number_ar}
                    </span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};