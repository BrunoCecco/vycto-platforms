import db from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import SiteCard from "./siteCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminSitesData } from "@/lib/fetchers";

export default async function Sites({ limit }: { limit?: number }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const sites = await getAdminSitesData(session.user.email);

  return sites.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sites.map((site) => (
        <SiteCard key={site.id} data={site} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="text-4xl">No Sites Yet</h1>
      <Image alt="missing site" src="/logo.png" width={400} height={400} />
      <p className="text-lg ">
        You do not have any sites yet. Create one to get started.
      </p>
    </div>
  );
}
