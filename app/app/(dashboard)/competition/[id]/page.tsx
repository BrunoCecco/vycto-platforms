import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import CompetitionCreator from "@/components/competition-creation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CompetitionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const data = await db.query.competitions.findFirst({
    where: (competitions, { eq }) =>
      eq(competitions.id, decodeURIComponent(params.id)),
    with: {
      site: {
        columns: {
          subdomain: true,
        },
      },
    },
  });

  if (
    !data ||
    (data.userId !== session.user.id && data.admin != session.user.email)
  ) {
    notFound();
  }

  return (
    <div>
      <CompetitionCreator />
    </div>
  );
}
