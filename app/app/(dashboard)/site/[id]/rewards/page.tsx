import { notFound, redirect } from "next/navigation";
import AnalyticsMockup from "@/components/analytics/analytics";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { SelectSiteReward } from "@/lib/schema";
import Form from "@/components/form";
import CombinedForm from "@/components/form/combined";
import { createSiteReward, updateSiteReward } from "@/lib/actions";
import Button from "@/components/buttons/button";
import { toast } from "sonner";
import CreateSiteRewardModal from "@/components/modal/createSiteReward";

export default async function SiteRewards({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.query.sites.findFirst({
    where: (sites, { eq }) => eq(sites.id, decodeURIComponent(params.id)),
  });

  const rewards = await db.query.siteRewards.findMany({
    where: (rewards, { eq }) =>
      eq(rewards.siteId, decodeURIComponent(params.id)),
  });

  if (!data) {
    notFound();
  }

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
            Monthly rewards for {data.name}
          </h1>
          <a
            href={`https://${url}`}
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {url} ↗
          </a>
        </div>
      </div>
      <CreateSiteRewardModal siteId={decodeURIComponent(params.id)} />

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
