import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import SiteSettingsNav from "./nav";
import db from "@/lib/db";
import { getSiteDomain } from "@/lib/utils";

export default async function SiteAnalyticsLayout({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const data = await db.query.sites.findFirst({
    where: (sites, { eq }) => eq(sites.id, decodeURIComponent(params.id)),
  });

  if (!data) {
    notFound();
  }

  const url = getSiteDomain(data);

  return (
    <>
      <div className="flex flex-col items-center space-x-4 space-y-2 sm:flex-row sm:space-y-0">
        <h1 className="text-xl font-bold  sm:text-3xl">
          Settings for {data.name}
        </h1>
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </a>
      </div>
      <SiteSettingsNav />
      {children}
    </>
  );
}
