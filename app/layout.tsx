import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Script from "next/script";
import dynamic from "next/dynamic";
import ColorSchemeToggle from "@/components/ui/colorSchemeToggle";
import CookieBanner from "@/components/settings/cookieBanner";

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
  icons: ["/favicon.ico"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          cal.variable,
          inter.variable,
          "bg-background text-foreground",
        )}
      >
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
      </body>
    </html>
  );
}
