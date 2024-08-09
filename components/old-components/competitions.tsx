import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import CompetitionCard from "./competition-card";

export default async function Competitions({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const competitions = await db.query.competitions.findMany({
    where: (competitions, { and, eq }) =>
      and(
        eq(competitions.userId, session.user.id),
        siteId ? eq(competitions.siteId, siteId) : undefined,
      ),
    with: {
      site: true,
    },
    orderBy: (competitions, { desc }) => desc(competitions.updatedAt),
    ...(limit ? { limit } : {}),
  });

  return competitions.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {competitions &&
        competitions.map((competition: any) => (
          <CompetitionCard key={competition.id} data={competition} />
        ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Competitions Yet</h1>
      <Image
        alt="missing competition"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any competitions yet. Create one to get started.
      </p>
    </div>
  );
}
