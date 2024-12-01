import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Script from "next/script";
import dynamic from "next/dynamic";
import ColorSchemeToggle from "@/components/ui/colorSchemeToggle";

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
          "text-foreground bg-background",
        )}
      >
        {/* <Script
          defer
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-host="https://api.eu-central-1.aws.tinybird.co"
          data-token="p.eyJ1IjogIjllOGNmNTViLTRhOTQtNGU0MC1hZDM1LWU3YjYxMzRkMTJlNyIsICJpZCI6ICIxY2YxNjgyNS0yZDQ3LTQzOTEtYTg2My01NWI2MDcxMDAwY2IiLCAiaG9zdCI6ICJhd3MtZXUtY2VudHJhbC0xIn0.nIz77lsApRDOdpKjlQhXJTHWhbX8u9wN4vWUDsUtgGY"
        /> */}
        <Providers>
          <PostHogPageView />
          <Analytics />
          {children}
          <div className="fixed right-0 top-0 z-50 sm:right-2 sm:top-2">
            <ColorSchemeToggle />
          </div>
        </Providers>
      </body>
    </html>
  );
}
