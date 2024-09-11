import { notFound } from "next/navigation";
import { getCompetitionsForSite, getSiteData } from "@/lib/fetchers";
import db from "@/lib/db";
import FanZone from "@/components/fanZone";
import { SelectCompetition } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import FanZoneHeader from "@/components/fazoneHeader";

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

  const session = await getSession();

  return (
    <>
      <div className="mx-5 max-w-screen-xl pb-20 lg:mx-24 2xl:mx-auto">
        {/* Use the FanZoneHeader component */}
        <FanZone
          siteData={data}
          currentCompetitions={
            competitions.filter(
              (competition: any) =>
                new Date(competition.date).getTime() >= Date.now(),
            ) as SelectCompetition[]
          }
          pastCompetitions={
            competitions.filter(
              (competition: any) =>
                new Date(competition.date).getTime() < Date.now(),
            ) as SelectCompetition[]
          }
          latestCompetition={latestCompetition}
        />
        <div className="my-10" />
      </div>
    </>
  );
}
