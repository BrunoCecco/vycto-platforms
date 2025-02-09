import Loading from "@/components/ui/loading";
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
  return <Suspense fallback={<Loading data={data} />}>{children}</Suspense>;
}
