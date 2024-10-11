import ClaimRewardsCard from "@/components/rewards/claimRewardsCard";
import ClaimedRewards from "@/components/rewards/claimedRewards";
import PendingRewards from "@/components/rewards/pendingRewards";
import RewardsList from "@/components/rewards/rewardsList";
import FlipText from "@/components/ui/flipText";
import { getSession } from "@/lib/auth";
import {
  getCompetitionsForPeriod,
  getCompetitionsForSite,
  getSiteData,
} from "@/lib/fetchers";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

export default async function Rewards({
  params,
}: {
  params: { domain: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

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

  return (
    <div className="min-h-screen text-white">
      <div className="mb-8 flex justify-center">
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
      <FlipText word="Your Rewards" className="mb-8 text-4xl" />
      <div className="mb-8 grid w-full grid-cols-1 items-center justify-center md:grid-cols-3">
        <div className="col-span-1 mr-auto">
          <PendingRewards count={0} amount={0} />
        </div>
        <div className="col-span-1 mx-auto">
          <ClaimRewardsCard comp={latestCompetition} />
        </div>
        <div className="col-span-1 ml-auto">
          <ClaimedRewards count={0} amount={0} />
        </div>
      </div>
      <div>
        <RewardsList />
      </div>
    </div>
  );
}
