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
          <h1 className="text-xl font-bold  sm:text-3xl">
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
                inputAttrs={[
                  {
                    name: "title",
                    type: "text",
                    defaultValue: reward.title || "",
                    label: "Title",
                  },
                  {
                    name: "description",
                    type: "text",
                    defaultValue: reward.description || "",
                    label: "Description",
                  },
                  {
                    name: "image",
                    type: "file",
                    defaultValue: reward.image || "",
                    label: "Image",
                  },
                  {
                    name: "startDate",
                    type: "date",
                    defaultValue: new Date(reward?.startDate!)
                      .toISOString()
                      .split("T")[0],
                    label: "Start date of reward period",
                  },
                  {
                    name: "endDate",
                    type: "date",
                    defaultValue: new Date(reward?.endDate!)
                      .toISOString()
                      .split("T")[0],
                    label: "End date of reward period",
                  },
                  {
                    name: "rewardWinners",
                    type: "number",
                    defaultValue: reward.rewardWinners?.toString() || "1",
                    label: "Number of reward winners",
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
          <p className="text-lg ">No rewards available</p>
        </div>
      )}
    </>
  );
}
