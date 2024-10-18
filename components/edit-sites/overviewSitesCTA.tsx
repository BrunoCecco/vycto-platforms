import CreateSiteButton from "../edit-fanzone/createSiteButton";
import CreateSiteModal from "../modal/create-site";
import Link from "next/link";
import db from "@/lib/db";
import { sites } from "@/lib/schema";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function OverviewSitesCTA() {
  const session = await getServerSession();
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
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      View All Playgrounds
    </Link>
  ) : (
    <CreateSiteButton>
      <CreateSiteModal />
    </CreateSiteButton>
  );
}
