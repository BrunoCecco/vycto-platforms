import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import EditFanzone from "@/components/editFanzone";
import db from "@/lib/db";

export default async function SiteCompetitions({
  params,
}: {
  params: { id: string };
}) {
  // Fetch session
  const session = await getSession();
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
  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    : `http://${data.subdomain}.localhost:3000`;

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
