import CompetitionCard from "@/components/competitions/competitionCard";
import HelpCards from "@/components/howtoplay/helpcards";
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
import { SelectAnswer, SelectQuestion } from "@/lib/schema";
import { QuestionType } from "@/lib/types";
import { ArrowBigDown, ArrowDownNarrowWide } from "lucide-react";
import { getServerSession } from "next-auth";
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
    className="flex flex-col items-center rounded-lg border bg-content1 p-6 shadow-lg"
    // color={color}
  >
    {children}
  </div>
);

export default async function HowToPlayPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const [data, latestCompData] = await Promise.all([
    getSiteData(domain),
    getLatestCompetitionForSite(domain),
  ]);
  const session = await getServerSession(authOptions);
  console.log(session, "session");
  console.log("here");
  const questions = await getQuestionsForCompetition(latestCompData[0].id);

  const question = questions[0];

  const reward = await getSiteRewards(domain);
  const seasonReward = reward.find(
    (r) => r.year === new Date().getFullYear() && r.month === -1,
  );

  return (
    <HelpCards
      data={data}
      latestCompData={latestCompData}
      session={session}
      question={question}
      seasonReward={seasonReward}
    />
  );
}
