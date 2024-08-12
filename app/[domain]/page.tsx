import Link from "next/link";
import { notFound } from "next/navigation";
import BlurImage from "@/components/old-components/blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import BlogCard from "@/components/old-components/blog-card";
import { getCompetitionsForSite, getSiteData } from "@/lib/fetchers";
import Image from "next/image";
import db from "@/lib/db";

import FanZone from "@/components/fanZone";
import GuessScore from "@/components/questions/guessScore";
import MatchOutcome from "@/components/questions/matchOutcome";
import PlayerGoals from "@/components/questions/playerGoals";
import PlayerSelection from "@/components/questions/playerSelection";
import TrueFalse from "@/components/questions/trueFalse";
import WhatMinute from "@/components/questions/whatMinute";

export async function generateStaticParams() {
  const allSites = await db.query.sites.findMany({
    // feel free to remove this filter if you want to generate paths for all sites
    where: (sites, { eq }) => eq(sites.subdomain, "demo"),
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
  const [data, competitions] = await Promise.all([
    getSiteData(domain),
    getCompetitionsForSite(domain),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="mx-5 max-w-screen-xl pb-20 lg:mx-24 2xl:mx-auto">
        <div className="ease left-0 right-0 top-0 z-30 flex transition-all duration-150 dark:bg-black dark:text-white">
          <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 p-10 sm:p-20">
            <Link href="/" className="flex items-center justify-center">
              <div className="">
                <Image
                  alt={data.name || ""}
                  height={80}
                  src={data.logo || ""}
                  width={200}
                />
              </div>
              <div
                className="pt-1font-title ml-3 rounded-full bg-blue-200 px-8 py-2 pt-1 font-title font-medium text-white"
                style={{ backgroundColor: data.color2 }}
              >
                play
              </div>
            </Link>
          </div>
        </div>

        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 p-10 pt-0 sm:p-20 sm:pt-0">
          <Image
            alt={"Banner image"}
            width={1200}
            height={630}
            className="h-full w-full object-cover"
            src={data.image ?? "/placeholder.png"}
          />
        </div>
        <FanZone
          currentCompetitions={competitions.filter(
            (competition: any) => new Date(competition.endDate) > new Date(),
          )}
          pastCompetitions={competitions.filter(
            (competition: any) => new Date(competition.endDate) < new Date(),
          )}
        />
        <TrueFalse />
        <WhatMinute />
        <MatchOutcome />
        <GuessScore />
        <PlayerGoals />
        <PlayerSelection />
        {/* {competitions.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
            {competitions &&
              competitions.map((metadata: any, index: number) => (
                <BlogCard key={index} data={metadata} />
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              alt="missing competition"
              src="https://illustrations.popsy.co/gray/success.svg"
              width={400}
              height={400}
              className="dark:hidden"
            />
            <Image
              alt="missing competition"
              src="https://illustrations.popsy.co/white/success.svg"
              width={400}
              height={400}
              className="hidden dark:block"
            />
            <p className="font-title text-2xl text-stone-600 dark:text-stone-400">
              No competitions yet.
            </p>
          </div>
        )} */}
      </div>
    </>
  );
}
