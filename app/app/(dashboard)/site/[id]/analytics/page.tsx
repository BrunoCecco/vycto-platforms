import { notFound, redirect } from "next/navigation";
import Analytics from "@/components/analytics/analytics";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { getSiteDomain } from "@/lib/utils";
import { getSiteDataById } from "@/lib/fetchers";
import { Link } from "@nextui-org/react";

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
          <Link
            href={`https://${url}`}
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md px-2 py-1 text-sm font-medium transition-colors"
          >
            {url} ↗
          </Link>
        </div>
      </div>
      <Analytics posthogSrc={data.posthogSrc} />
    </>
  );
}
