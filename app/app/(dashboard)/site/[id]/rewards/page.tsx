import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { SelectSiteReward } from "@/lib/schema";
import CombinedForm from "@/components/form/combined";
import { updateSiteReward } from "@/lib/actions";
import CreateSiteRewardModal from "@/components/modal/createSiteReward";
import { getSiteDomain } from "@/lib/utils";
import {
  getSiteDataById,
  getSiteRewards,
  getSiteRewardsById,
} from "@/lib/fetchers";

export default async function SiteRewards({
  params,
}: {
  params: { id: string };
}) {
  const data = await getSiteDataById(decodeURIComponent(params.id));

  const rewards = await getSiteRewardsById(decodeURIComponent(params.id));

  if (!data) {
    notFound();
  }

  const url = getSiteDomain(data);

  return (
    <>
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="text-xl font-bold dark:text-white sm:text-3xl">
            Monthly rewards for {data.name}
          </h1>
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <CreateSiteRewardModal siteId={decodeURIComponent(params.id)} />
      </div>

      {rewards && rewards.length > 0 ? (
        <div className="flex flex-col gap-4">
          {rewards.map((reward: SelectSiteReward, i: number) => (
            <div key={reward.id} className="">
              <CombinedForm
                title={reward.title || "Reward " + i}
                helpText="Edit the reward details."
                descriptions={[
                  "Title",
                  "Description",
                  "Image",
                  "Start date of reward period",
                  "End date of reward period",
                  "Number of reward winners",
                ]}
                inputAttrs={[
                  {
                    name: "title",
                    type: "text",
                    defaultValue: reward.title || "",
                  },
                  {
                    name: "description",
                    type: "text",
                    defaultValue: reward.description || "",
                  },
                  {
                    name: "image",
                    type: "image",
                    defaultValue: reward.image || "/logo.png",
                  },
                  {
                    name: "startDate",
                    type: "date",
                    defaultValue: new Date(reward?.startDate!)
                      .toISOString()
                      .split("T")[0],
                  },
                  {
                    name: "endDate",
                    type: "date",
                    defaultValue: new Date(reward?.endDate!)
                      .toISOString()
                      .split("T")[0],
                  },
                  {
                    name: "rewardWinners",
                    type: "number",
                    defaultValue: reward.rewardWinners?.toString() || "1",
                  },
                ]}
                handleSubmit={updateSiteReward}
                updateId={reward.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg dark:text-white">No rewards available</p>
        </div>
      )}
    </>
  );
}
