"use client";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Country, CountryDetails } from "@/types/api/country";
import useFetch from "@/hooks/UseFetch";
import { ApiResponse, ApiResponseBase } from "@/types/api/http";

interface CountryCodeData {
  id: number;
  name: string;
  phone_code: string;
  flag: string;
}
export interface PhoneNumberProps<T extends FieldValues> {
  control: Control<T>;
  phoneCodeName: FieldPath<T>;
  phoneNumberName: FieldPath<T>;
  countries: CountryCodeData[];
  currentPhoneLimit?: number | null;
  isLoading?: boolean;
  disabled?: boolean;
  codeClass?: string;
  phoneClass?: string;
}
function PhoneField<T extends FieldValues>({
  control,
  phoneCodeName,
  phoneNumberName,
  currentPhoneLimit,
  isLoading = false,
  codeClass = "",
  phoneClass = "",
  disabled = false,
}: PhoneNumberProps<T>) {
  const {t} = useTranslation();
    const { data, isPending } = useFetch<ApiResponseBase<CountryDetails[]>, CountryCodeData[]>({
      queryKey: [`countries`],
      endpoint: 'countries',
      select: (data)=>{
        return data.data.map(item=>({ id: item.id, name: item.short_name, flag: item.flag, phone_code: item.phone_code } as unknown as CountryCodeData))
      },
      staleTime: 180_000,
    })  
    console.log(data)
  return (
    <div className="flex gap-2">
      <FormField<T>
        control={control}
        name={phoneCodeName}
        render={({ field }) => (
          <FormItem className="w-32">
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              disabled={isLoading || disabled}
            >
              <FormControl>
                <SelectTrigger
                  className={`text-text p-1 sm:p-4 ${codeClass}`}
                  dir={t("lang")}
                >
                  <SelectValue placeholder={t("labels.phoneCode")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent dir={t("lang")}>
                {data?.map((country) => (
                  <SelectItem key={country.id} value={`${country.phone_code}`}>
                    <div className="flex items-center gap-2">
                      {country.flag && (
                        <span role="img" aria-label="flag">
                          <img
                            src={country.flag}
                            alt={`${country.name} flag`}
                            width={20}
                            height={20}
                            className="size-5"
                          />
                        </span>
                      )}
                      <span className="ms-2">{`+${country.phone_code}`}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField<T>
        control={control}
        name={phoneNumberName}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                dir={t("lang")}
                {...field}
                className={phoneClass}
                onChange={(e) => {
                  field.onChange(e);
                }}
                value={field.value || ""}
                disabled={isLoading || disabled}
                placeholder={
                  currentPhoneLimit
                    ? t("labels.phoneNumberWithLimit", {
                        limit: currentPhoneLimit,
                      })
                    : t("labels.phoneNumber")
                }
                type="tel"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default PhoneField;