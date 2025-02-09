import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCompetitionsForSite, getSiteData } from "@/lib/fetchers";
import { fontMapper } from "@/styles/fonts";
import { Metadata } from "next";
import SettingsButton from "@/components/settings/settingsButton";
import SiteNav from "@/components/nav/siteNav";
import Profile from "@/components/nav/profile";
import Loading from "../../components/ui/loading";
import { capitalize } from "@/lib/utils";
import LoadingDots from "@/components/icons/loadingDots";
import PlayButton from "@/components/buttons/playButton";
import { toast } from "sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SelectCompetition } from "@/lib/schema";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  if (!data) {
    return null;
  }

  return {
    title: data.name,
    description: data.description,
    openGraph: {
      title: data.name || "",
      description: data.description || "",
      images: [data.loginBanner || "/logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: data.name || "",
      description: data.description || "",
      images: [data.loginBanner || "/logo.png"],
    },
    icons: [data.logo || "/logo.png"],
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   data.customDomain && {
    //     alternates: {
    //       canonical: `https://${data.customDomain}`,
    //     },
    //   }),
  };
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  const session = await getServerSession(authOptions);

  if (!data) {
    notFound();
  }

  const compData = await getCompetitionsForSite(domain);

  const competitions: SelectCompetition[] = compData.map(
    (competition: any) => competition.competition,
  );

  const currentComps = competitions.filter(
    (competition: any) =>
      new Date(competition.date.replace(/\[.*\]$/, "")).getTime() >= Date.now(),
  );

  const sortedCurrentComps = currentComps.sort(
    (a: any, b: any) =>
      new Date(a.date.replace(/\[.*\]$/, "")).getTime() -
      new Date(b.date.replace(/\[.*\]$/, "")).getTime(),
  );

  const earliestCurrentComp = sortedCurrentComps[0];

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return (
    <div className={`flex min-h-screen`}>
      <div className="relative z-50 w-0 sm:w-1/5">
        <SiteNav
          data={data}
          latestCompetitionUrl={
            earliestCurrentComp ? `/comp/${earliestCurrentComp?.slug}` : "/"
          }
          session={session}
        >
          <Profile />
        </SiteNav>
      </div>
      <div className="relative w-full max-w-screen-2xl sm:w-4/5">
        <div className="mx-5 flex flex-col items-center justify-between gap-4 pt-5 sm:mx-24 sm:hidden sm:items-start">
          <div className="flex items-center gap-4">
            {/* <Link href="/">
              <Image
                src={data.logo || "/logo.png"}
                alt="Logo"
                width={50}
                height={50}
                className=""
              />
            </Link> */}
            {/* <Link href={`/comp/${latestCompetition?.slug}` || "/"}>
              <PlayButton color1={data.color1} color2={data.color2}>
                Play
              </PlayButton>
            </Link> */}
          </div>
        </div>
        <div className={`mx-5 pb-20 pt-8 lg:mx-24`}>{children}</div>
      </div>
    </div>
  );
}
