import { notFound } from "next/navigation";
import {
  getCompetitionsForSite,
  getSiteData,
  getUserCompetitions,
  getUserData,
} from "@/lib/fetchers";
import db from "@/lib/db";
import FanZone from "@/components/fanzone/fanZone";
import { SelectCompetition } from "@/lib/schema";
import { getServerSession } from "next-auth";
import SettingsButton from "@/components/settings/settingsButton";
import Image from "next/image";
import { capitalize } from "@/lib/utils";
import { fontMapper } from "@/styles/fonts";
import { Suspense } from "react";
import LoadingDots from "@/components/icons/loadingDots";
import Loading from "../../components/ui/loading";
import { authOptions } from "@/lib/auth";
import ColorSchemeToggle from "@/components/ui/colorSchemeToggle";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

// export async function generateStaticParams() {
//   const allSites = await db.query.sites.findMany({
//     columns: {
//       subdomain: true,
//       customDomain: true,
//     },
//   });

//   const allPaths = allSites
//     .flatMap(({ subdomain, customDomain }) => [
//       subdomain && {
//         domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//       },
//       customDomain && { domain: customDomain },
//     ])
//     .filter(Boolean);

//   return allPaths;
// }

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const t = await getTranslations();
  const domain = decodeURIComponent(params.domain);
  const [data, compData] = await Promise.all([
    getSiteData(domain),
    getCompetitionsForSite(domain),
  ]);

  const competitions = compData.map(
    (competition: any) => competition.competition,
  );

  if (!data) {
    notFound();
  }

  const latestCompetition = competitions.sort(
    (a: any, b: any) =>
      new Date(b.date.replace(/\[.*\]$/, "")).getTime() -
      new Date(a.date.replace(/\[.*\]$/, "")).getTime(),
  )[0];

  const session = await getServerSession(authOptions);

  const userCompetitions = await getUserCompetitions(
    session?.user.id || "",
    data.id,
  );

  const addFanzoneToString = (str: string) => {
    if (str?.includes("fanzone")) return str;
    return str + " " + t("fanzone");
  };

  return (
    <div>
      <div className="flex items-center pb-8 text-2xl font-bold tracking-wider sm:text-4xl">
        <Link href="/">
          <Image
            src={data.logo || "/logo.png"}
            alt="Logo"
            width={50}
            height={50}
            className=""
          />
        </Link>
        <h1 className="ml-2">
          {capitalize(addFanzoneToString(data.name || ""))}
        </h1>
      </div>

      {/* Use the FanZoneHeader component */}
      <Suspense fallback={<Loading data={data} />}>
        <FanZone
          siteData={data}
          currentCompetitions={
            competitions
              .filter(
                (competition: any) =>
                  new Date(competition.date.replace(/\[.*\]$/, "")).getTime() >=
                  Date.now(),
              )
              .sort(
                (a: any, b: any) =>
                  new Date(a.date.replace(/\[.*\]$/, "")).getTime() -
                  new Date(b.date.replace(/\[.*\]$/, "")).getTime(),
              ) as SelectCompetition[]
          }
          pastCompetitions={
            competitions
              .filter(
                (competition: any) =>
                  new Date(competition.date.replace(/\[.*\]$/, "")).getTime() <
                  Date.now(),
              )
              .sort(
                (a: any, b: any) =>
                  new Date(a.date.replace(/\[.*\]$/, "")).getTime() -
                  new Date(b.date.replace(/\[.*\]$/, "")).getTime(),
              ) as SelectCompetition[]
          }
          latestCompetition={latestCompetition}
          session={session}
          userCompetitions={userCompetitions?.map((uc) => uc.userComp)}
        />
      </Suspense>
      <div className="my-4 sm:my-10" />
    </div>
  );
}
