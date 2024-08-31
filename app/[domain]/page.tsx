import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompetitionsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";
import db from "@/lib/db";

import FanZone from "@/components/fanZone";
import { SelectCompetition } from "@/lib/schema";
import Leaderboard from "@/components/leaderboard";

export async function generateStaticParams() {
  const allSites = await db.query.sites.findMany({
    // feel free to remove this filter if you want to generate paths for all sites
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
      customDomain && {
        domain: customDomain,
      },
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

  return (
    <>
      <div className="mx-5 max-w-screen-xl pb-20 lg:mx-24 2xl:mx-auto">
        <div className="ease left-0 right-0 top-0 z-30 flex transition-all duration-150 dark:text-white">
          <div className="my-6 mr-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 sm:my-12">
            <div className="">
              <Image
                alt={data.name || ""}
                height={80}
                src={data.logo || ""}
                width={200}
              />
            </div>
            <Link
              className="ml-3 rounded-full bg-blue-200 px-8 py-2 pt-1 font-semibold text-white"
              style={{ backgroundColor: data.color2 }}
              href={`/${latestCompetition?.slug}` ?? "/"}
            >
              Play
            </Link>
          </div>
        </div>

        <div className="mb-6 mr-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 sm:mb-12">
          <Image
            alt={"Banner image"}
            width={1200}
            height={630}
            className="h-full w-full object-cover"
            src={data.image ?? "/placeholder.png"}
          />
        </div>
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
        />
        <div className="my-10" />
        <Leaderboard siteData={data} users={[]} />
      </div>
    </>
  );
}
