import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import CompetitionCreator from "@/components/competition-creation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAdminSites,
  getCompetitionDataWithSite,
  getCompetitionFromId,
  getSiteAdmins,
} from "@/lib/fetchers";

export default async function CompetitionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const data = await getCompetitionDataWithSite(decodeURIComponent(params.id));
  if (!data?.site) {
    notFound();
  }
  const siteAdmins = await getSiteAdmins(data?.site.id);

  if (
    !data ||
    (data.userId !== session.user.id &&
      !siteAdmins.find((admin) => admin.email === session.user.email))
  ) {
    notFound();
  }

  return (
    <div>
      <CompetitionCreator siteId={data.site.id} compId={data.id} />
    </div>
  );
}
