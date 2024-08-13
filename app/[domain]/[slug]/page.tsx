import { notFound } from "next/navigation";
import {
  getAnswersForUser,
  getCompetitionData,
  getCompetitionUsers,
  getQuestionsForCompetition,
  getSiteData,
} from "@/lib/fetchers";
import BlogCard from "@/components/old-components/blog-card";
import BlurImage from "@/components/old-components/blur-image";
import MDX from "@/components/old-components/mdx";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import db from "@/lib/db";
import { competitions, sites } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Leaderboard from "@/components/leaderboard";
import { answerQuestion, enterUserToCompetition } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import EnterCompetitionButton from "@/components/old-components/enter-competition-button";
import TrueFalse from "@/components/questions/trueFalse";
import WhatMinute from "@/components/questions/whatMinute";
import MatchOutcome from "@/components/questions/matchOutcome";
import GuessScore from "@/components/questions/guessScore";
import PlayerGoals from "@/components/questions/playerGoals";
import PlayerSelection from "@/components/questions/playerSelection";
import { QuestionType } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);

  const [data, siteData] = await Promise.all([
    getCompetitionData(domain, slug),
    getSiteData(domain),
  ]);
  if (!data || !siteData) {
    return null;
  }
  const { title, description } = data;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@vercel",
    },
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   siteData.customDomain && {
    //     alternates: {
    //       canonical: `https://${siteData.customDomain}/${params.slug}`,
    //     },
    //   }),
  };
}

export async function generateStaticParams() {
  const allCompetitions = await db
    .select({
      slug: competitions.slug,
      site: {
        subdomain: sites.subdomain,
        customDomain: sites.customDomain,
      },
    })
    .from(competitions)
    .leftJoin(sites, eq(competitions.siteId, sites.id))
    .where(eq(sites.subdomain, "demo")); // feel free to remove this filter if you want to generate paths for all competitions

  const allPaths = allCompetitions
    .flatMap(({ site, slug }) => [
      site?.subdomain && {
        domain: `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        slug,
      },
      site?.customDomain && {
        domain: site.customDomain,
        slug,
      },
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SiteCompetitionPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const session = await getSession();
  const data = await getCompetitionData(domain, slug);
  const questions = await getQuestionsForCompetition(data!.id);
  const answers = await getAnswersForUser(session?.user.id!, data!.id);
  let users;

  if (session && data) {
    await enterUserToCompetition(
      session.user.id,
      session.user.username,
      data.id,
    );
    users = await getCompetitionUsers(data!.id);
  }

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-8">
        {session?.user &&
        users &&
        !users.find((u) => u.userId === session.user.id) ? (
          <EnterCompetitionButton
            userId={session.user.id}
            username={session.user.username}
            competitionId={data.id}
          />
        ) : (
          <div>Competition Entered</div>
        )}
        <div className="relative m-auto my-4 w-5/6 max-w-screen-lg md:my-12 lg:w-2/3">
          <BlurImage
            alt={data.title ?? "Competition image"}
            width={1200}
            height={630}
            className="h-full w-full rounded-2xl object-cover"
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
            src={data.image ?? "/placeholder.png"}
          />
        </div>
        <div className="m-auto w-full text-center md:w-7/12">
          <p className="m-auto mb-4 w-10/12 text-sm font-light text-white md:text-base dark:text-stone-300">
            {new Date(data.startDate).toLocaleDateString()} -{" "}
            {new Date(data.endDate).toLocaleDateString()}
          </p>
          <h1 className="mb-4 font-title text-lg font-bold text-stone-800 md:text-2xl dark:text-white">
            Competition: {data.title}
          </h1>
          <p className="text-md m-auto mb-8 w-10/12 text-stone-600 md:text-lg dark:text-stone-400">
            by {data.site?.name}
          </p>
        </div>
        {/* <div className="my-8">
          <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
            <BlurImage
              alt={"User Avatar"}
              height={80}
              src={
                data.site?.user?.image ??
                `https://avatar.vercel.sh/${data.title}`
              }
              width={80}
            />
          </div>
          <div className="text-md ml-3 inline-block align-middle md:text-lg dark:text-white">
            by{" "}
            <span className="font-semibold">
              {data?.site?.user?.name ??
                data?.site?.user?.username ??
                data?.site?.user?.email}
            </span>
          </div>
        </div> */}
      </div>

      <div className="mx-auto my-8 flex w-full flex-col justify-center gap-8 ">
        {questions &&
          questions.map((question: any, index: number) => {
            // if (question.type === QuestionType.TrueFalse) {
            return (
              <TrueFalse
                key={index}
                {...question}
                userId={session?.user.id!}
                answer={
                  answers.find((a) => a.questionId === question.id)!.answer
                }
              />
            );
            // );
            // } else if (question.type === QuestionType.WhatMinute) {
            //   return <WhatMinute key={index} />;
            // } else if (question.type === QuestionType.MatchOutcome) {
            //   return <MatchOutcome key={index} />;
            // } else if (question.type === QuestionType.GuessScore) {
            //   return <GuessScore key={index} />;
            // } else if (question.type === QuestionType.PlayerGoals) {
            //   return <PlayerGoals key={index} />;
            // } else if (question.type === QuestionType.PlayerSelection) {
            //   return <PlayerSelection key={index} />;
            // }
          })}
        {/* <WhatMinute />
        <MatchOutcome />
        <GuessScore />
        <PlayerGoals />
        <PlayerSelection /> */}
      </div>

      <Leaderboard users={users} />

      {/* <MDX source={data.mdxSource} /> */}

      {data.adjacentCompetitions.length > 0 && (
        <div className="relative pb-20 pt-10 sm:pt-20">
          <div
            className="absolute inset-0 z-10 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-stone-300 dark:border-stone-700" />
          </div>
          <div className="relative z-20 mx-auto w-fit rounded-full bg-white px-6 text-center text-sm text-stone-500 dark:bg-black dark:text-stone-400">
            More competitions
          </div>
        </div>
      )}
      {data.adjacentCompetitions && (
        <div className="mx-5 grid max-w-screen-xl grid-cols-1 gap-x-4 gap-y-8 pb-20 md:grid-cols-2 xl:mx-auto xl:grid-cols-3">
          {data.adjacentCompetitions.map((data: any, index: number) => (
            <BlogCard key={index} data={data} />
          ))}
        </div>
      )}
    </>
  );
}
