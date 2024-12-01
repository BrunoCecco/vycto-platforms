import ClaimRewardsCard from "@/components/rewards/claimRewardsCard";
import ClaimedRewards from "@/components/rewards/claimedRewards";
import PendingRewards from "@/components/rewards/pendingRewards";
import RewardsList from "@/components/rewards/rewardsList";
import { BackgroundGradient } from "@/components/ui/backgroundGradient";
import FlipText from "@/components/ui/flipText";
import { TextGenerateEffect } from "@/components/ui/textGenerateEffect";
import { authOptions } from "@/lib/auth";
import {
  getCompetitionsForPeriod,
  getCompetitionsForSite,
  getSiteData,
  getSiteRewards,
  getUserCompetitions,
} from "@/lib/fetchers";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

export default async function Rewards({
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

  const siteRewards = await getSiteRewards(domain);

  return (
    <div className="min-h-screen">
      <BackgroundGradient
        containerClassName="h-[50px] w-full rounded-lg"
        className="p-0"
      >
        <div className="bg-content3 flex h-full w-full items-center rounded-lg p-2 font-bold">
          Coming soon!
        </div>
      </BackgroundGradient>
      <div className="my-8 flex justify-center">
        <Image
          src={
            session.user.image ||
            `https://avatar.vercel.sh/${session.user.email}`
          }
          width={100}
          height={100}
          className="rounded-full"
          alt="Profile Image"
        />
      </div>
      <TextGenerateEffect words="Your Rewards" className="mb-8 text-2xl" />
      <div className="mb-8 grid w-full grid-cols-1 items-center justify-center gap-8 md:grid-cols-3">
        <div className="col-span-1 md:mr-auto">
          <PendingRewards count={0} amount={0} />
        </div>
        <div className="col-span-1 mx-auto">
          <ClaimRewardsCard
            comp={latestCompetition}
            latestReward={siteRewards[siteRewards.length - 1]}
          />
        </div>
        <div className="col-span-1 md:ml-auto">
          <ClaimedRewards count={0} amount={0} />
        </div>
      </div>
      <div>
        <RewardsList userCompetitions={userCompetitions} />
      </div>
    </div>
  );
}
