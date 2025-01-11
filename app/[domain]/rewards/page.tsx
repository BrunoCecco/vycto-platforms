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
import { getLeaderboardName, makeTransparent } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

export default async function Rewards({
  params,
}: {
  params: { domain: string };
}) {
  const t = await getTranslations();
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
    (a: any, b: any) =>
      new Date(b.date.replace(/\[.*\]$/, "")).getTime() -
      new Date(a.date.replace(/\[.*\]$/, "")).getTime(),
  )[0];

  const userCompetitions = await getUserCompetitions(session.user.id, data.id);

  const siteRewards = await getSiteRewards(domain);

  const yearReward = siteRewards.find(
    (reward) => reward.year === new Date().getFullYear() && reward.month === -1,
  );

  return (
    <div className="min-h-screen">
      <BackgroundGradient
        containerClassName="h-[50px] w-full rounded-lg mb-4"
        className="p-0"
        color1={data.color1}
        color2={makeTransparent(data.color1, 0.7)}
        color3={"#FFFFFF"}
        color4={makeTransparent(data.color1, 0)}
        color5={makeTransparent(data.color1, 0.7)}
      >
        <div className="flex h-full w-full items-center rounded-lg bg-content3 p-2 font-bold">
          {t("comingsoon")}
        </div>
      </BackgroundGradient>
      <div className="relative mx-auto mb-4 mt-8 flex h-20 w-20 justify-center">
        <Image
          src={
            session.user.image ||
            `https://avatar.vercel.sh/${session.user.email}`
          }
          fill
          className="h-full w-full rounded-full object-cover"
          alt="Profile Image"
        />
      </div>
      <TextGenerateEffect words={t("yourrewards")} className="mb-2 text-2xl" />
      <div className="mx-auto mb-8 text-center">
        @{getLeaderboardName(session.user)}
      </div>
      <div className="mb-8 grid w-full grid-cols-1 items-center justify-center gap-8 md:grid-cols-3">
        <div className="col-span-1 md:mr-auto">
          <PendingRewards count={0} amount={0} />
        </div>
        <div className="col-span-1">
          <ClaimRewardsCard reward={yearReward || siteRewards[0]} data={data} />
        </div>
        <div className="col-span-1 md:ml-auto">
          <ClaimedRewards count={0} amount={0} />
        </div>
      </div>
      <div>
        <RewardsList
          userCompetitions={userCompetitions.map((comp) => comp.userComp)}
        />
      </div>
    </div>
  );
}
