import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { SelectSiteReward } from "@/lib/schema";
import CombinedForm from "@/components/form/combined";
import { updateSiteReward } from "@/lib/actions";
import CreateSiteReward from "@/components/modal/createSiteReward";
import { getSiteDomain } from "@/lib/utils";
import {
  getSiteDataById,
  getSiteRewards,
  getSiteRewardsById,
} from "@/lib/fetchers";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";
import { MONTHS } from "@/lib/constants";
import BucketStorage from "@/components/media/bucketStorage";
import SiteReward from "@/components/rewards/siteReward";
import SiteRewardsPage from "@/components/rewards/siteRewardsPage";

export default async function SiteRewards({
  params,
}: {
  params: { id: string };
}) {
  const data = await getSiteDataById(decodeURIComponent(params.id));

  const rewards = await getSiteRewardsById(decodeURIComponent(params.id));

  const yearReward = rewards.find(
    (reward) => reward.year === new Date().getFullYear() && reward.month === -1,
  );

  if (!data) {
    notFound();
  }

  const url = getSiteDomain(data);

  return (
    <>
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="text-xl font-bold  sm:text-3xl">
            Monthly/Yearly rewards for {data.name}
          </h1>
        </div>
      </div>

      <SiteRewardsPage data={data} rewards={rewards} />
    </>
  );
}
