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
  <CardSpotlight
    className="flex flex-col items-center rounded-lg p-6 shadow-lg"
    color={color}
  >
    {children}
  </CardSpotlight>
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
  const questions = await getQuestionsForCompetition(
    latestCompData[0].competition.id,
  );

  const question = questions[0];

  const reward = await getSiteRewards(domain);
  const seasonReward = reward.find(
    (r) => r.year === new Date().getFullYear() && r.month === -1,
  );

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
            onLocalAnswer={() => {}}
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
            onLocalAnswer={() => {}}
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
            onLocalAnswer={() => {}}
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
            onLocalAnswer={() => {}}
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
            onLocalAnswer={() => {}}
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
            onLocalAnswer={() => {}}
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
            onLocalAnswer={() => {}}
            hasEnded={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="mb-6 text-3xl font-bold">How to Play</h1>

      <HelpCard color={data?.color1}>
        <h2 className=" relative z-20 mb-4 text-2xl font-semibold">
          1. Enter a Competition
        </h2>
        <p className="relative z-20 mb-4 ">
          Browse our active competitions and click &ldquo;Play&ldquo;.
        </p>
        {data ? (
          <CompetitionCard
            competition={latestCompData[0].competition}
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
          2. Answer Questions
        </h2>
        <p className="relative z-20 mb-4 ">Submit your answers!</p>
        {data && questions && question ? (
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
          3. Earn Points
        </h2>
        <p className="relative z-20  mb-4 ">
          Points will be calculated after the event and you will be placed on a
          leaderboard.
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
          4. Win Rewards
        </h2>
        <p className="relative z-20  mb-4 ">
          Top performers in each competition have a chance to win exciting
          rewards.
        </p>
        <p className="mb-4 ">
          Check the competition details for specific reward information.
        </p>
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
