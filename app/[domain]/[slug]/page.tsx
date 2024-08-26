import { notFound, redirect } from "next/navigation";
import {
  getAnswersForUser,
  getCompetitionData,
  getCompetitionUsers,
  getQuestionsForCompetition,
  getSiteData,
} from "@/lib/fetchers";
import BlogCard from "@/components/old-components/blog-card";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import db from "@/lib/db";
import {
  competitions,
  SelectQuestion,
  SelectUserCompetition,
  sites,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import Leaderboard from "@/components/leaderboard";
import {
  answerQuestion,
  calculateUserPoints,
  enterUserToCompetition,
  submitAnswers,
} from "@/lib/actions";
import { getSession } from "@/lib/auth";
import TrueFalse from "@/components/questions/trueFalse";
import WhatMinute from "@/components/questions/whatMinute";
import MatchOutcome from "@/components/questions/matchOutcome";
import GuessScore from "@/components/questions/guessScore";
import GeneralSelection from "@/components/questions/generalSelection";
import PlayerSelection from "@/components/questions/playerSelection";
import { QuestionType } from "@/lib/types";
import CompetitionHeader from "@/components/competitionHeader";
import TabSelector from "@/components/tabSelector";
import SubmitAnswersForm from "@/components/form/submit-answers-form";
import Link from "next/link";
import GameStats from "@/components/gameStats";
import GeneralNumber from "@/components/questions/generalNumber";
import Rewards from "@/components/rewards";

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
    .leftJoin(sites, eq(competitions.siteId, sites.id));

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
  const siteData = await getSiteData(domain);
  const slug = decodeURIComponent(params.slug);
  const session = await getSession();
  const data = await getCompetitionData(domain, slug);
  let questions;
  let answers: any;
  let users;
  let userComp: SelectUserCompetition | undefined | { error: string };
  if (data) {
    questions = await getQuestionsForCompetition(data.id);
    answers = await getAnswersForUser(session?.user.id!, data!.id);
  }
  if (data && new Date(data.date).getTime() < Date.now()) {
    // calculate points
    const points = await calculateUserPoints(session?.user.id!, data!.id);
    console.log(points, "points");
  }

  if (session && data) {
    userComp = await enterUserToCompetition(
      session.user.id,
      session.user.username || session.user.name || session.user.email,
      data.id,
    );
    if (userComp && "submitted" in userComp && userComp.submitted) {
      redirect(`/${slug}/${userComp.userId}`);
    }
    users = await getCompetitionUsers(data!.id);
  }

  if (!data) {
    notFound();
  }

  const getQuestionType = (
    type: QuestionType,
    question: SelectQuestion,
    userId: string,
    index: number,
    answer: string,
    disabled: boolean,
  ) => {
    switch (type) {
      case QuestionType.TrueFalse:
        return (
          <TrueFalse
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.WhatMinute:
        return (
          <WhatMinute
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.PlayerSelection:
        return (
          <PlayerSelection
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.MatchOutcome:
        return (
          <MatchOutcome
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.GuessScore:
        return (
          <GuessScore
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.GeneralSelection:
        return (
          <GeneralSelection
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.GeneralNumber:
        return (
          <GeneralNumber
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className=""
      style={{
        backgroundColor: siteData?.color1 ?? "white",
      }}
    >
      <CompetitionHeader session={session} users={users} data={data} />
      <TabSelector />
      <Rewards
        rewardTitle={data.rewardTitle}
        rewardDescription={data.rewardDescription}
        rewardImage={data.rewardImage}
        reward2Title={data.reward2Title}
        reward2Description={data.reward2Description}
        reward2Image={data.reward2Image}
      />
      {/* Challenge bit is below */}
      <div className="mx-auto flex w-full flex-col justify-center gap-8 p-8 pt-0 ">
        {questions &&
          questions.map((question: any, index: number) => {
            const answer = answers?.find(
              (a: any) => a.questionId === question.id,
            );
            const disabled =
              userComp && "submitted" in userComp && userComp?.submitted;
            return getQuestionType(
              question.type,
              question,
              session?.user.id!,
              index,
              answer?.answer,
              disabled || false,
            );
          })}
        {userComp && "submitted" in userComp && userComp.submitted ? (
          <div className="mx-auto flex h-8 w-fit items-center justify-center space-x-2 rounded-md border border-green-600 bg-green-600 px-2 text-sm text-white sm:h-10">
            Answers Submitted
          </div>
        ) : (
          <SubmitAnswersForm
            userId={session?.user.id!}
            competitionId={data.id}
            slug={slug}
          />
        )}
      </div>
      {/* {activeTab === "Leaderboard" && <Leaderboard users={users} />} */}

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
    </div>
  );
}
