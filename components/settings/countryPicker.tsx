"use client";

import {
  useTimezoneSelect,
  ITimezoneOption,
  allTimezones,
} from "react-timezone-select";
import { Select, SelectItem } from "@tremor/react";

export default function CountryPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle: "original",
    timezones: allTimezones,
  });
  return (
    <Select name={name} defaultValue={defaultValue}>
      {options?.map((timezone: ITimezoneOption) => (
        <SelectItem key={timezone.value} value={timezone.value}>
          {timezone.label}
        </SelectItem>
      ))}
      <SelectItem value="None">None</SelectItem>
    </Select>
  );
}
