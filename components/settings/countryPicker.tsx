"use client";

import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

export default function CountryPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) {
  const [selected, setSelected] = useState("");

  return (
    <ReactFlagsSelect
      selectButtonClassName="w-full max-w-md rounded-md border"
      selected={selected}
      onSelect={(code) => setSelected(code)}
    />
  );
}
