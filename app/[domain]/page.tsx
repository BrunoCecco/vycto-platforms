import { notFound } from "next/navigation";
import { getCompetitionsForSite, getSiteData } from "@/lib/fetchers";
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

export async function generateStaticParams() {
  const allSites = await db.query.sites.findMany({
    columns: {
      subdomain: true,
      customDomain: true,
    },
  });

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && { domain: customDomain },
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
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
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];

  const session = await getServerSession(authOptions);

  const addFanzoneToString = (str: string) => {
    if (str?.includes("fanzone")) return str;
    return str + " FANZONE";
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-8 text-2xl font-bold tracking-wider sm:text-4xl">
        <h1>{capitalize(addFanzoneToString(data.name || ""))}</h1>
      </div>
      {/* Use the FanZoneHeader component */}
      <Suspense fallback={<Loading data={data} />}>
        <FanZone
          siteData={data}
          currentCompetitions={
            competitions
              .filter(
                (competition: any) =>
                  new Date(competition.date).getTime() >= Date.now(),
              )
              .sort(
                (a: any, b: any) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              ) as SelectCompetition[]
          }
          pastCompetitions={
            competitions
              .filter(
                (competition: any) =>
                  new Date(competition.date).getTime() < Date.now(),
              )
              .sort(
                (a: any, b: any) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              ) as SelectCompetition[]
          }
          latestCompetition={latestCompetition}
          user={session?.user}
        />
      </Suspense>
      <div className="my-4 sm:my-10" />
    </div>
  );
}
