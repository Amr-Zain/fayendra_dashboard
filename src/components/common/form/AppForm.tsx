"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import Field from "./Field";
import { FieldProp } from "@/types/components/form";

interface GeneralFormConfig<T extends Record<string, any>> {
  schema: z.ZodSchema<T>;
  fields: FieldProp<T>[];
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  onError?: (errors: any) => void;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean; 
  isLoading?: boolean;
  className?: string;
  formClassName?: string;
  gridColumns?: number;
  spacing?: "sm" | "md" | "lg";
}

// Form layout configuration
interface FormLayoutConfig {
  containerClassName?: string;
  fieldContainerClassName?: string;
  buttonContainerClassName?: string;
  submitButtonClassName?: string;
  resetButtonClassName?: string;
}

function AppForm<T extends Record<string, any>>({
  schema,
  fields,
  defaultValues,
  onSubmit,
  onError,
  submitButtonText = "Submit",
  resetButtonText = "Reset",
  showResetButton = false, // Default to false to make it optional
  isLoading = false,
  className = "",
  formClassName = "",
  gridColumns = 1,
  spacing = "md",
  ...layoutConfig
}: GeneralFormConfig<T> & FormLayoutConfig) {
  // Added global error state for form-level errors
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      // Clear any previous global errors
      setGlobalError(null);
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      
      // Set global error message
      if (error instanceof Error) {
        setGlobalError(error.message);
      } else {
        setGlobalError("An unexpected error occurred. Please try again.");
      }

      // Call custom error handler if provided
      if (onError) {
        onError(error);
      }
    }
  };

  const handleReset = () => {
    // Clear global error when resetting
    setGlobalError(null);
    form.reset(defaultValues);
  };

  // Dynamic spacing classes using shadcn color variables
  const spacingClasses = {
    sm: "space-y-3",
    md: "space-y-4",
    lg: "space-y-6",
  };

  // Dynamic grid classes
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };
  console.log(form.getValues())
  return (
    <div
      className={`w-full ${className} ${layoutConfig.containerClassName || ""}`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`${spacingClasses[spacing]} ${formClassName}`}
        >
          {/* Global Error Display - Added to show form-level errors */}
          {globalError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}

          {/* Fields Container */}
          <div
            className={`grid gap-4 ${
              gridClasses[gridColumns as keyof typeof gridClasses] ||
              "grid-cols-1"
            } ${layoutConfig.fieldContainerClassName || ""}`}
          >
            {fields.map((fieldConfig, index) => {
              // Handle custom fields without name/control
              if (fieldConfig.type === "custom") {
                return (
                  <div
                    key={`custom-${index}`}
                    className={
                      fieldConfig.span ? `col-span-${fieldConfig.span}` : ""
                    }
                  >
                    <Field {...fieldConfig} />
                  </div>
                );
              }

              return (
                <div
                  key={String(fieldConfig.name)}
                  className={
                    fieldConfig.span ? `col-span-${fieldConfig.span}` : ""
                  }
                >
                  <Field {...fieldConfig} control={form.control} />
                </div>
              );
            })}
          </div>

          {/* Buttons Container */}
          <div
            className={`flex gap-3 pt-4 ${
              showResetButton ? "justify-between" : "justify-end"
            } ${layoutConfig.buttonContainerClassName || ""}`}
          >
            {/* Only show reset button if showResetButton is true */}
            {showResetButton && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
                className={`${layoutConfig.resetButtonClassName || ""} border-border text-foreground hover:bg-muted hover:text-foreground`}
              >
                {resetButtonText}
              </Button>
            )}

            <Button
              type="submit"
              disabled={isLoading /* || !form.formState.isValid */}
              className={`min-w-[120px] bg-primary text-primary-foreground hover:bg-primary/90 ${
                layoutConfig.submitButtonClassName || ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AppForm;
export type { GeneralFormConfig, FormLayoutConfig };