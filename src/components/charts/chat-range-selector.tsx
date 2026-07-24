"use client";

import { DateRange } from "@/types/chars/date-range";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function ChartRangeSelector({ value, onChange }: Props) {
  return (
    <Select
      value={value as string}
      onValueChange={(value) => onChange(value as DateRange)}
    >
      <SelectTrigger
        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
        aria-label="Select a value"
      >
        <SelectValue placeholder="Last 3 months" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectItem value="all" className="rounded-lg">
          Tutti
        </SelectItem>
        <SelectItem value="3y" className="rounded-lg">
          Ultimi 3 anni
        </SelectItem>
        <SelectItem value="1y" className="rounded-lg">
          Ultimo anno
        </SelectItem>
        <SelectItem value="90d" className="rounded-lg">
          Ultimi 3 mesi
        </SelectItem>
        <SelectItem value="30d" className="rounded-lg">
          Ultimi 30 giorni
        </SelectItem>
        <SelectItem value="7d" className="rounded-lg">
          Ultimi 7 giorni
        </SelectItem>
        <SelectItem value="1d" className="rounded-lg">
          Oggi
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
