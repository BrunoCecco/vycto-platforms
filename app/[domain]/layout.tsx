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
      className={fontMapper[data.font]}
      style={{
        backgroundColor: data.color1 ?? "green",
        minHeight: "100vh",
      }}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-4 p-5">
          <Link href="/">
            <Image
              src={data.logo ?? "/logo.png"}
              alt="Logo"
              width={100}
              height={100}
            />
          </Link>
          <Link
            className="ml-3 rounded-full px-8 py-2 pt-1 font-semibold text-white hover:opacity-75"
            style={{ backgroundColor: data.color2 || "#1E40AF" }} // Default color fallback
            href={`/comp/${latestCompetition?.slug}` ?? "/"}
          >
            Play
          </Link>
        </div>

        <SiteNav>
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        </SiteNav>
      </div>
      {children}
    </div>
  );
}
