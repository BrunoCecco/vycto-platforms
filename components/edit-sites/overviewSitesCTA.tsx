import CreateSiteButton from "../edit-fanzone/createSiteButton";
import CreateSiteModal from "../modal/createSite";
import Link from "next/link";
import db from "@/lib/db";
import { sites } from "@/lib/schema";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function OverviewSitesCTA() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const [sitesResult] = await db
    .select({ count: count() })
    .from(sites)
    .where(eq(sites.userId, session.user.id));

  return sitesResult.count > 0 ? (
    <Link
      href="/sites"
      className="dark:hover: hover: rounded-lg border px-4 py-1.5 text-sm font-medium transition-all "
    >
      View All Playgrounds
    </Link>
  ) : (
    <CreateSiteButton>
      <CreateSiteModal />
    </CreateSiteButton>
  );
}
