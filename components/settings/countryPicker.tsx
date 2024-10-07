"use client";

import {
  useTimezoneSelect,
  ITimezoneOption,
  allTimezones,
} from "react-timezone-select";
import { Select, SelectItem } from "@tremor/react";

export default function CountryPicker() {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle: "original",
    timezones: allTimezones,
  });
  return (
    <Select>
      {options?.map((timezone: ITimezoneOption) => (
        <SelectItem key={timezone.value} value={timezone.value}>
          {timezone.label}
        </SelectItem>
      ))}
      <SelectItem value="None">None</SelectItem>
    </Select>
  );
}
