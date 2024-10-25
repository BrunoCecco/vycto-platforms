import CurrentPredictions from "@/components/my-competitions/currentPredictions";
import PastPredictions from "@/components/my-competitions/pastPredictions";
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
            {/* User Stats */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold">@BRUN09</h1>
              <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
                <div className="text-5xl font-bold">
                  12.3K
                  <p className="text-sm font-normal text-gray-400">points</p>
                </div>
                <div className="text-5xl font-bold">
                  13
                  <p className="text-sm font-normal text-gray-400">victories</p>
                </div>
                <div className="text-5xl font-bold">
                  1<p className="text-sm font-normal text-gray-400">mvp</p>
                </div>
              </div>
            </div>

            {/* Top Predictions Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold">
                top predictions{" "}
                <span className="font-normal text-gray-400">powered by</span>{" "}
                <span className="text-red-500">Superbet</span>
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-800">
                  <Image
                    src="/player.png"
                    alt="Prediction 3-0"
                    layout="fill"
                    objectFit="cover"
                  />
                  <span className="absolute left-2 top-2 text-lg font-bold text-white">
                    3 - 0
                  </span>
                </div>
                <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-800">
                  <Image
                    src="/player.png"
                    alt="Prediction 5-2"
                    layout="fill"
                    objectFit="cover"
                  />
                  <span className="absolute left-2 top-2 text-lg font-bold text-white">
                    5 - 2
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12">
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
