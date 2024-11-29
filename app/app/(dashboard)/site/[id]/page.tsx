import { notFound, redirect } from "next/navigation";
import EditFanzone from "@/components/edit-fanzone/editFanzone";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteDomain } from "@/lib/utils";
import { getSiteDataById } from "@/lib/fetchers";

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
  const data = await getSiteDataById(decodeURIComponent(params.id));

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
