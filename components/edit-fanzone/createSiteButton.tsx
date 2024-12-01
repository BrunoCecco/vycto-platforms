"use client";

import { useModal } from "@/components/modal/provider";
import { ReactNode } from "react";

export default function CreateSiteButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      className="dark:hover: hover: rounded-lg border border-black bg-black px-4 py-1.5  text-sm font-medium transition-all hover:bg-white active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:active:bg-stone-800"
    >
      Create New Site
    </button>
  );
}
