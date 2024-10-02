import Loading from "@/app/app/(dashboard)/loading";
import { getSiteData } from "@/lib/fetchers";
import { Suspense } from "react";

export default async function SiteCompetitionLayout({
  params,
  children,
}: {
  params: { domain: string; slug: string };
  children: React.ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  return (
    <Suspense fallback={<Loading logo={data?.logo} />}>{children}</Suspense>
  );
}
