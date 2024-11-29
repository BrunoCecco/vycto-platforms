import { notFound, redirect } from "next/navigation";
import EditFanzone from "@/components/edit-fanzone/editFanzone";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteDomain } from "@/lib/utils";

export default async function SiteCompetitions({
  params,
}: {
  params: { id: string };
}) {
  // Fetch session
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Fetch site data from the database
  const data = await db.query.sites.findFirst({
    where: (sites, { eq }) => eq(sites.id, decodeURIComponent(params.id)),
  });

  // Handle cases where data is not found or user is not authorized
  if (
    !data ||
    (data.userId !== session.user.id && data.admin !== session.user.email)
  ) {
    notFound();
  }

  // Generate the URL
  const url = getSiteDomain(data);

  // Render the EditFanzone component and pass necessary props
  return (
    <EditFanzone
      data={data}
      url={url}
      siteId={decodeURIComponent(params.id)}
      latestCompetition
    />
  );
}
