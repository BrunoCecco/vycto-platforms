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

  const bannerImages = {
    logoPlaySrc: "/logoPlay.png",
    bannerSrc: "/banner.jpg",
  };

  const currentCompetitions = [
    {
      imageSrc: "/atletiCurrent.jpg",
      title: "Atletico vs Inter",
      sponsor: "Tanqueray",
      statusInfo: "24 hours left",
    },
    {
      imageSrc: "/atletiCurrent.jpg",
      title: "Atletico vs Athletic",
      sponsor: "Tanqueray",
      statusInfo: "24 hours left",
    },
  ];

  const pastCompetitions = [
    {
      imageSrc: "/atletiPast.jpg",
      title: "Atletico vs Alaves",
      sponsor: "Tanqueray",
      statusInfo: "2.72K participants",
    },
    {
      imageSrc: "/atletiPast.jpg",
      title: "Atletico vs Inter Miami",
      sponsor: "Tanqueray",
      statusInfo: "902 participants",
    },
  ];

  return (
    <>
      <div className="mx-5 max-w-screen-xl pb-20 lg:mx-24 2xl:mx-auto">
        <FanZone
          bannerImages={bannerImages}
          currentCompetitions={currentCompetitions}
          pastCompetitions={pastCompetitions}
        />
        <TrueFalse />
        <WhatMinute />
        <MatchOutcome />
        <GuessScore />
        <PlayerGoals />
        <PlayerSelection />
        {competitions.length > 0 ? (
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
        )}
      </div>
    </>
  );
}
