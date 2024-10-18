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
import Loading from "../app/(dashboard)/loading";
import { capitalize } from "@/lib/utils";
import LoadingDots from "@/components/icons/loadingDots";
import PlayButton from "@/components/buttons/playButton";
import { toast } from "sonner";
import { getServerSession } from "next-auth";

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
  const {
    name: title,
    description,
    image,
    logo,
  } = data as {
    name: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title,
    description,
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
      creator: "@vercel",
    },
    icons: [logo],
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
  const session = await getServerSession();

  if (!data) {
    notFound();
  }

  const compData = await getCompetitionsForSite(domain);

  const competitions = compData.map(
    (competition: any) => competition.competition,
  );

  const latestCompetition = competitions.sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return (
    <div
      className={`${fontMapper["font-space"]} flex min-h-screen bg-slate-950 font-space`}
    >
      <div className="relative z-50 w-0 sm:w-1/5">
        <SiteNav
          data={data}
          latestCompetitionUrl={`/comp/${latestCompetition?.slug}`}
          session={session}
        >
          <Profile />
        </SiteNav>
      </div>
      <div className="relative w-full max-w-screen-2xl sm:w-4/5">
        <div className="mx-5 flex flex-col items-center justify-between gap-4 pt-5 sm:mx-24 sm:hidden sm:items-start">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src={data.logo ?? "/logo.png"}
                alt="Logo"
                width={50}
                height={50}
                className=""
              />
            </Link>
            <Link href={`/comp/${latestCompetition?.slug}` ?? "/"}>
              <PlayButton color1={data.color1} color2={data.color2}>
                Play
              </PlayButton>
            </Link>
          </div>
        </div>
        <div className={`mx-5 pb-20 pt-8 text-white lg:mx-24 dark:text-black`}>
          {children}
        </div>
      </div>
    </div>
  );
}
