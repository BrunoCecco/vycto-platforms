"use client";
import UserSettings from "@/components/settings/userSettings";
import { SessionProvider } from "next-auth/react";

export default async function SettingsPage() {
  return (
    <SessionProvider>
      <UserSettings />
    </SessionProvider>
  );
}
