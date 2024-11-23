import { notFound, redirect } from "next/navigation";
import AnalyticsMockup from "@/components/analytics/analytics";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { SelectSiteReward } from "@/lib/schema";
import Form from "@/components/form";

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
            Rewards for {data.name}
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
      {rewards && rewards.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 xl:grid-cols-4">
          {rewards.map((reward: SelectSiteReward) => (
            <div
              key={reward.id}
              className="rounded-lg bg-stone-800 p-4 dark:bg-stone-700"
            >
              <h2 className="text-lg font-bold dark:text-white">
                {reward.title}
              </h2>
              <p className="text-sm dark:text-white">{reward.description}</p>
              <p className="text-sm dark:text-white"></p>
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
