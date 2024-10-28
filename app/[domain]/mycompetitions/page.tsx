import CurrentPredictions from "@/components/my-competitions/currentPredictions";
import PastPredictions from "@/components/my-competitions/pastPredictions";
import PredictionStats from "@/components/my-competitions/predictionStats";
import ProfileCard from "@/components/my-competitions/profileCard";
import ClaimRewardsCard from "@/components/rewards/claimRewardsCard";
import ClaimedRewards from "@/components/rewards/claimedRewards";
import PendingRewards from "@/components/rewards/pendingRewards";
import RewardsList from "@/components/rewards/rewardsList";
import FlipText from "@/components/ui/flipText";
import { TextGenerateEffect } from "@/components/ui/textGenerateEffect";
import { authOptions } from "@/lib/auth";
import {
  getCompetitionsForPeriod,
  getCompetitionsForSite,
  getSiteData,
  getUserCompetitions,
} from "@/lib/fetchers";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

export default async function mycompetitions({
  params,
}: {
  params: { domain: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  console.log(session);

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

  const userCompetitions = await getUserCompetitions(session.user.id);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Container */}
      <div className="mx-auto max-w-7xl pt-3">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Profile Card with Sticky Position */}
          <div className="w-full self-start lg:sticky lg:top-12 lg:w-1/3">
            <ProfileCard />
          </div>

          {/* Right Stats and Top Predictions */}
          <div className="w-full lg:w-2/3">
            {/* <PredictionStats /> */}
            <div>
              <CurrentPredictions />
            </div>
            <div className="mt-12">
              <PastPredictions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
