import "@/styles/globals.css";
import { cal, inter, fira, fontMapper } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Script from "next/script";
import dynamic from "next/dynamic";
import ColorSchemeToggle from "@/components/ui/colorSchemeToggle";
import CookieBanner from "@/components/settings/cookieBanner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";

const PostHogPageView = dynamic(() => import("./postHogPageView"), {
  ssr: false,
});
const title = "Vycto - Sports Sponsorship Activation & Gamification Platform";
const description =
  "Gamifying Sports Sponsorships. We help sports brands activate on their sponsorship IP using gamification to generate real, tangible, measurable ROI.";
const image = "/logo.png";

export const metadata: Metadata = {
  title,
  description,
  icons: [image],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const font = locale == "el-CY" ? "font-fira" : "font-space";

  return (    
      <html lang={locale} suppressHydrationWarning>
        <body
          className={cn("bg-background text-foreground", fontMapper[font])}
          style={{ fontFamily: `var(--${font})` }}
        >
          <NextIntlClientProvider messages={messages}>
          <Providers>
            <PostHogPageView />
            <Analytics />
            {children}
            <div className="fixed right-0 top-0 z-50 sm:right-2 sm:top-2">
              <ColorSchemeToggle />
            </div>
            <div className="absolute bottom-0 left-0 z-50">
              <CookieBanner />
            </div>
          </Providers>
          </NextIntlClientProvider>
        </body>
      </html>    
  );
}
