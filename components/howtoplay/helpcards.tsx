"use client";
import CompetitionCard from "@/components/competitions/competitionCard";
import MainLeaderboard from "@/components/leaderboard/mainLeaderboard";
import GeneralNumber from "@/components/questions/generalNumber";
import GeneralSelection from "@/components/questions/generalSelection";
import GuessScore from "@/components/questions/guessScore";
import MatchOutcome from "@/components/questions/matchOutcome";
import PlayerSelection from "@/components/questions/playerSelection";
import TrueFalse from "@/components/questions/trueFalse";
import WhatMinute from "@/components/questions/whatMinute";
import ClaimRewardsCard from "@/components/rewards/claimRewardsCard";
import UserSettings from "@/components/settings/userSettings";
import { CardSpotlight } from "@/components/ui/cardSpotlight";
import FluidCursor from "@/components/ui/fluidCursor";
import { authOptions } from "@/lib/auth";
import {
  getLatestCompetitionForSite,
  getQuestionsForCompetition,
  getSiteData,
  getSiteRewards,
} from "@/lib/fetchers";
import {
  SelectAnswer,
  SelectCompetition,
  SelectQuestion,
  SelectSite,
  SelectSiteReward,
} from "@/lib/schema";
import { QuestionType } from "@/lib/types";
import { ArrowBigDown, ArrowDownNarrowWide } from "lucide-react";
import { getServerSession, Session } from "next-auth";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Arrow = () => (
  <div className="rounded-full">
    <ArrowBigDown className="mx-auto h-12 w-12 " />
  </div>
);

const HelpCard = ({
  color,
  children,
}: {
  color?: string;
  children: React.ReactNode;
}) => (
  <div
    className="flex flex-col items-center rounded-lg border bg-content1 p-6 text-center shadow-lg"
    // color={color}
  >
    {children}
  </div>
);

export default function HelpCards({
  data,
  latestCompData,
  session,
  question,
  seasonReward,
}: {
  data?: SelectSite;
  latestCompData: SelectCompetition[];
  session: Session | null;
  question: SelectQuestion;
  seasonReward?: SelectSiteReward;
}) {
  const t = useTranslations();
  const getQuestionType = (
    question: SelectQuestion,
    answer: SelectAnswer | { answer: string | null } | undefined,
    disabled: boolean,
  ) => {
    switch (question.type) {
      case QuestionType.TrueFalse:
        return (
          <TrueFalse
            {...question}
            answer={answer}
            disabled={disabled}
            color={data?.color1 || "#000"}
            userId=""
            hasEnded={false}
          />
        );
      case QuestionType.WhatMinute:
        return (
          <WhatMinute
            {...question}
            answer={answer}
            disabled={disabled}
            color={data?.color1 || "#000"}
            userId=""
            hasEnded={false}
          />
        );
      case QuestionType.PlayerSelection:
        return (
          <PlayerSelection
            {...question}
            answer={answer}
            disabled={disabled}
            color={data?.color1 || "#000"}
            userId=""
            hasEnded={false}
          />
        );
      case QuestionType.MatchOutcome:
        return (
          <MatchOutcome
            {...question}
            answer={answer}
            disabled={disabled}
            color={data?.color1 || "#000"}
            userId=""
            hasEnded={false}
          />
        );
      case QuestionType.GuessScore:
        return (
          <GuessScore
            {...question}
            answer={answer}
            disabled={disabled}
            color={data?.color1 || "#000"}
            userId=""
            hasEnded={false}
          />
        );
      case QuestionType.GeneralSelection:
        return (
          <GeneralSelection
            {...question}
            answer={answer}
            disabled={disabled}
            color={data?.color1 || "#000"}
            userId=""
            hasEnded={false}
          />
        );
      case QuestionType.GeneralNumber:
        return (
          <GeneralNumber
            {...question}
            answer={answer}
            disabled={disabled}
            color={data?.color1 || "#000"}
            userId=""
            hasEnded={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <FluidCursor color={data?.color1 || "#123456"} />
      <h1 className="mb-6 text-3xl font-bold">{t("howtoplay.title")}</h1>

      <HelpCard color={data?.color1}>
        <h2 className=" relative z-20 mb-4 text-2xl font-semibold">
          1. {t("howtoplay.enter.title")}
        </h2>
        <p className="relative z-20 mb-4 ">
          {t("howtoplay.enter.description")}
        </p>
        {data ? (
          <CompetitionCard
            competition={latestCompData[0]}
            siteData={data}
            type="past"
          />
        ) : (
          <Image
            src={"/playButton.png"}
            alt="Play"
            width={300}
            height={300}
            className="relative z-20 overflow-hidden rounded-md"
          />
        )}
      </HelpCard>

      <Arrow />

      <HelpCard color={data?.color1}>
        <h2 className="relative z-20 mb-4 text-2xl font-semibold ">
          2. {t("howtoplay.answer.title")}
        </h2>
        <p className="relative z-20 mb-4 ">
          {t("howtoplay.answer.description")}
        </p>
        {data && question ? (
          getQuestionType(question, { answer: "" }, true)
        ) : (
          <Image
            src={"/answerQuestion.png"}
            alt="Answer"
            width={300}
            height={300}
            className="relative z-20 overflow-hidden rounded-md"
          />
        )}
      </HelpCard>

      <Arrow />

      <HelpCard color={data?.color1}>
        <h2 className="relative z-20 mb-4 text-2xl font-semibold ">
          3. {t("howtoplay.earn.title")}
        </h2>
        <p className="relative z-20  mb-4 ">
          {t("howtoplay.earn.description")}
        </p>
        {data ? (
          <MainLeaderboard siteData={data} session={session} limit={5} />
        ) : (
          <Image
            src={"/leaderboard.png"}
            alt="leaderboard"
            width={300}
            height={300}
            className="relative z-20 overflow-hidden rounded-md"
          />
        )}
      </HelpCard>

      <Arrow />

      <HelpCard color={data?.color1}>
        <h2 className="relative z-20  mb-4 text-2xl font-semibold ">
          4. {t("howtoplay.win.title")}
        </h2>
        <p className="relative z-20  mb-4">{t("howtoplay.win.description")}</p>
        <p className="mb-4 ">{t("howtoplay.win.description2")}</p>
        {seasonReward && data ? (
          <div className="relative w-[300px]">
            <ClaimRewardsCard data={data} reward={seasonReward} />
          </div>
        ) : (
          <Image
            src={"/reward.png"}
            alt="Reward"
            width={300}
            height={300}
            className="relative z-20 overflow-hidden rounded-md"
          />
        )}
      </HelpCard>
    </div>
  );
}
