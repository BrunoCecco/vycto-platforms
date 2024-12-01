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
      selectButtonClassName="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black  dark:placeholder-stone-700"
      selected={selected}
      onSelect={(code) => setSelected(code)}
    />
  );
}
