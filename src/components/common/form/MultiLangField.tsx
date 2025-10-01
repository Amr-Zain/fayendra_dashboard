"use client";

import React, { useState, useEffect } from "react";
import { Control, useWatch, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import EditorField from "./Editor/EditorField";

export interface MultiLangFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: string; // Base name (e.g., "title")
  type?: "input" | "editor";
  label?: string;
  placeholder?: string;
  languages?: Array<{
    key: string;
    label: string;
  }>;
  defaultLanguage?: string;
  disabled?: boolean;
  className?: string;
}

const defaultLanguages = [
  { key: "en", label: "English" },
  { key: "ar", label: "العربية" },
];

function MultiLangField<T extends FieldValues>({
  control,
  name,
  type = "input",
  label,
  placeholder,
  languages = defaultLanguages,
  defaultLanguage,
  disabled = false,
  className = "",
}: MultiLangFieldProps<T>) {
  const [currentLang, setCurrentLang] = useState<number>(0);

  useEffect(() => {
    if (defaultLanguage) {
      const langIndex = languages.findIndex(
        (lang) => lang.key === defaultLanguage
      );
      if (langIndex !== -1) {
        setCurrentLang(langIndex);
      }
    }
  }, [defaultLanguage, languages]);

  // Watch all language fields to show completion status
  const watchedFields = languages.map((lang) =>
    useWatch({
      control,
      name: `${name}_${lang.key}` as FieldPath<T>,
    })
  );

  const renderField = (langKey: string, langIndex: number) => {
    const fieldName = `${name}_${langKey}` as FieldPath<T>;

    return (
      <FormField
        key={langKey}
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className={currentLang === langIndex ? "" : "hidden"}>
            <FormControl>
              {type === "editor" ? (
                <EditorField
                  field={field}
                  placeholder={
                    placeholder || `${label} (${languages[langIndex].label})`
                  }
                  disabled={disabled}
                />
              ) : (
                <Input
                  {...field}
                  placeholder={
                    placeholder || `${label} (${languages[langIndex].label})`
                  }
                  disabled={disabled}
                  value={field.value || ""}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const getFieldStatus = (index: number) => {
    const hasValue =
      watchedFields[index] && String(watchedFields[index]).trim().length > 0;
    return hasValue;
  };

  const completedCount = watchedFields.filter(
    (field) => field && String(field).trim().length > 0
  ).length;
  const progressPercentage = (completedCount / languages.length) * 100;

  return (
    <div className={`multi-lang-field-wrapper space-y-4 ${className}`}>
      {label && <FormLabel className="text-sm font-medium">{label}</FormLabel>}

      {/* Language Tabs */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border">
        {languages.map((lang, idx) => (
          <Button
            key={`lang_btn_${lang.key}`}
            type="button"
            variant={currentLang === idx ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentLang(idx)}
            disabled={disabled}
            className={`flex items-center gap-2 h-9 ${
              currentLang === idx
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted"
            }`}
          >
            {getFieldStatus(idx) && (
              <Check className="w-3 h-3 text-green-600" />
            )}
            <span>{lang.label}</span>
            {getFieldStatus(idx) && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                ✓
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Field Content */}
      <div className="relative">
        {languages.map((lang, idx) => renderField(lang.key, idx))}
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
       {/*  <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Translation Progress</span>
          <span className="font-medium">
            {completedCount} / {languages.length} completed
          </span>
        </div>

        <Progress value={progressPercentage} className="h-2" /> */}

        <div className="flex flex-wrap gap-2">
          {languages.map((lang, idx) => (
            <div
              key={`status_${lang.key}`}
              className="flex items-center gap-1 text-xs"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  getFieldStatus(idx)
                    ? "bg-green-500"
                    : "bg-muted-foreground/30"
                }`}
              />
              <span
                className={
                  getFieldStatus(idx)
                    ? "text-green-600"
                    : "text-muted-foreground"
                }
              >
                {lang.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MultiLangField;
