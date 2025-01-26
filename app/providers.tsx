"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { cookieConsentGiven } from "@/components/settings/cookieBanner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "always",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true,
      persistence:
        cookieConsentGiven() === "yes" ? "localStorage+cookie" : "memory",
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <NextUIProvider locale="en-GB" navigate={router.push}>
        <SessionProvider>
          <ModalProvider>
            <Toaster className="dark:hidden" />
            <Toaster theme="dark" className="hidden dark:block" />
            <PostHogProvider client={posthog}>{children}</PostHogProvider>
          </ModalProvider>
        </SessionProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
}
