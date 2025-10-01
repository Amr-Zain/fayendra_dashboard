"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
  FormField,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  DateRange,
  SelectSingleEventHandler,
  SelectRangeEventHandler,
} from "react-day-picker";
import { formatDMY } from "@/util/date";

export interface DateFieldsProps<T extends FieldValues> {
  control?: Control<T>;
  label?: string;
  className?: string;
  placeholder?: string;
  name?: FieldPath<T>;
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | DateRange;
  onSelect?: SelectSingleEventHandler | SelectRangeEventHandler;
  disabledDates?: {
    from?: Date;
    to?: Date;
  };
}

function DateFields<T extends FieldValues>({
  control,
  label,
  placeholder,
  name,
  className,
  mode = "single",
  selected,
  onSelect,
  disabledDates,
}: DateFieldsProps<T>) {
  const renderCalendar = (field?: any) => {
    let displayText;
    const value = field?.value || selected;

    if (mode === "single" && value instanceof Date) {
      displayText = formatDMY(value);
    } else if (mode === "range" && value && (value as DateRange).from) {
      const fromDate = (value as DateRange).from;
      const toDate = (value as DateRange).to;
      const formattedFrom = formatDMY(fromDate!);
      const formattedTo = toDate ? ` - ${formatDMY(toDate)}` : "";
      displayText = `${formattedFrom}${formattedTo}`;
    } else {
      displayText = placeholder || "Pick a date";
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "h-12 border-gray-200 text-left font-normal",
                !value && "text-muted-foreground",
                className
              )}
            >
              <span>{displayText}</span>
              <CalendarIcon className="ml-auto h-4 w-4 !text-text" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode={mode}
            selected={value}
            onSelect={field?.onChange || onSelect}
            disabled={
              disabledDates && disabledDates.from && disabledDates.to
                ? { from: disabledDates.from, to: disabledDates.to }
                : undefined
            }
            required
          />
        </PopoverContent>
      </Popover>
    );
  };

  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label && (
              <FormLabel className="font-medium text-gray-700">
                {label}
              </FormLabel>
            )}
            {renderCalendar(field)}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {label && (
        <FormLabel className="font-medium text-gray-700">{label}</FormLabel>
      )}
      {renderCalendar()}
    </div>
  );
}

export default DateFields;
