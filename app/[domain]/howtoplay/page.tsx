import CompetitionCard from "@/components/competitions/competitionCard";
import MainLeaderboard from "@/components/leaderboard/mainLeaderboard";
import TrueFalse from "@/components/questions/trueFalse";
import ClaimRewardsCard from "@/components/rewards/claimRewardsCard";
import UserSettings from "@/components/settings/userSettings";
import { CardSpotlight } from "@/components/ui/cardSpotlight";
import {
  getLatestCompetitionForSite,
  getQuestionsForCompetition,
  getSiteData,
  getSiteRewards,
} from "@/lib/fetchers";
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
  const session = await getServerSession();
  const questions = await getQuestionsForCompetition(
    latestCompData[0].competition.id,
  );

  const tfQuestion = questions.find((q) => q.type === QuestionType.TrueFalse);
  const reward = await getSiteRewards(domain);
  const seasonReward = reward.find(
    (r) => r.year === new Date().getFullYear() && r.month === -1,
  );

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
            type="current"
            // onClick={() => {}}
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
        {data && questions && tfQuestion ? (
          <TrueFalse
            {...tfQuestion}
            userId={session?.user.id}
            answer={{ answer: "" }}
            disabled={true}
            // onLocalAnswer={() => {}}
            color={data.color1}
          />
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
        {data && session ? (
          <MainLeaderboard siteData={data} session={session} />
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
