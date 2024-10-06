import ClaimRewardsCard from "@/components/rewards/claimRewardsCard";
import ClaimedRewards from "@/components/rewards/claimedRewards";
import PendingRewards from "@/components/rewards/pendingRewards";
import RewardsList from "@/components/rewards/rewardsList";
import FlipText from "@/components/ui/flipText";
import { getSession } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Rewards() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
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
      <div className="mb-8 grid grid-cols-1 items-center justify-center space-y-8 sm:space-x-8 md:grid-cols-4">
        <div className="col-span-1">
          <PendingRewards count={0} amount={0} />
        </div>
        <div className="col-span-2">
          <ClaimRewardsCard />
        </div>
        <div className="col-span-1">
          <ClaimedRewards count={0} amount={0} />
        </div>
      </div>
      <div>
        <RewardsList />
      </div>
    </div>
  );
}
