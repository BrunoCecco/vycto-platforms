import { notFound, redirect } from "next/navigation";
import AnalyticsMockup from "@/components/analytics/analytics";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { getSiteDomain } from "@/lib/utils";
import { getSiteDataById } from "@/lib/fetchers";

export default async function SiteAnalytics({
  params,
}: {
  params: { id: string };
}) {
  const data = await getSiteDataById(decodeURIComponent(params.id));

  if (!data) {
    notFound();
  }

  const url = getSiteDomain(data);

  return (
    <>
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex flex-col items-center space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="text-xl font-bold sm:text-3xl">
            Analytics for {data.name}
          </h1>
          <a
            href={`https://${url}`}
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {url} ↗
          </a>
        </div>
      </div>
      <AnalyticsMockup />
    </>
  );
}
