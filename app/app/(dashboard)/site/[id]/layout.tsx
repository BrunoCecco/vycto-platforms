import { ReactNode } from "react";
import db from "@/lib/db";

export default async function SiteLayout({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const siteData = await db.query.sites.findFirst({
    where: (sites, { eq }) => eq(sites.id, decodeURIComponent(params.id)),
  });

  return (
    <div
      className="flex  flex-col space-y-12 p-8"
      style={{
        backgroundColor: siteData?.color1,
        minHeight: "100vh",
      }}
    >
      <div className="flex flex-col space-y-6">{children}</div>
    </div>
  );
}
