"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";
import { PostHogProvider } from "posthog-js/react";

const options = {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <ModalProvider>
        <PostHogProvider
          apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
          options={options}
        >
          {children}
        </PostHogProvider>
      </ModalProvider>
    </SessionProvider>
  );
}
