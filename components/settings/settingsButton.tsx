"use client";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function SettingsButton() {
  return (
    <Link href="/settings">
      <Settings />
    </Link>
  );
}
