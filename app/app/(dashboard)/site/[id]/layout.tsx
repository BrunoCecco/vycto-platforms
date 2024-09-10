import { ReactNode } from "react";
import db from "@/lib/db";

export default async function SiteLayout({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const data = await db.query.sites.findFirst({
    where: (sites, { eq }) => eq(sites.id, decodeURIComponent(params.id)),
  });

  return (
    <div
      className="flex max-w-screen-xl flex-col space-y-12 p-8"
      style={{
        backgroundColor: data?.color1 ?? "green",
        minHeight: "100vh",
      }}
    >
      <div className="flex flex-col space-y-6">{children}</div>
    </div>
  );
}
