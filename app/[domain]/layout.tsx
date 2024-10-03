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

  const addFanzoneToString = (str: string) => {
    if (str?.includes("fanzone")) return str;
    return str + " FANZONE";
  };

  return (
    <div className={`${fontMapper[data.font]} flex min-h-screen bg-slate-800`}>
      <div className="relative z-50 w-0 sm:w-1/5">
        <SiteNav
          data={data}
          latestCompetitionUrl={`/comp/${latestCompetition?.slug}`}
        >
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        </SiteNav>
      </div>
      <div className="max-w-screen-2x relative w-full sm:w-4/5">
        <div className="mx-5 flex flex-col items-center justify-between gap-4 pt-5 sm:hidden">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src={data.logo ?? "/logo.png"}
                alt="Logo"
                width={100}
                height={100}
                className=""
              />
            </Link>
            <Link
              className={`ml-3 rounded-full px-8 py-2 font-semibold text-white shadow-md shadow-gray-600 transition-all duration-200 hover:shadow-none`}
              style={{
                backgroundImage: `linear-gradient(45deg, ${data.color2}, ${data.color1})`,
              }}
              href={`/comp/${latestCompetition?.slug}` ?? "/"}
            >
              Play
            </Link>
          </div>

          <div className="text-2xl font-bold text-white sm:text-4xl">
            {capitalize(addFanzoneToString(data.name || ""))}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
