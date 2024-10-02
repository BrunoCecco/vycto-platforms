import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import CompetitionCard from "./editCompetitionCard";
import CreateCompetitionButton from "./createCompetitionButton";

export default async function EditCompetitions({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
    console.log("HERE");
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

  const pastCompetitions = competitions.filter(
    (competition: any) =>
      new Date(competition.date).getTime() < Date.now() &&
      competition.published,
  );

  const currentCompetitions = competitions.filter(
    (competition: any) =>
      new Date(competition.date).getTime() >= Date.now() &&
      competition.published,
  );

  const draftedCompetitions = competitions.filter(
    (competition: any) => !competition.published,
  );

  return (
    <div className="mt-10">
      {draftedCompetitions && draftedCompetitions?.length > 0 && (
        <h1 className="my-4 font-cal text-2xl dark:text-white">
          Drafted Competitions
        </h1>
      )}
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 xl:grid-cols-4">
        <CreateCompetitionButton />
        {draftedCompetitions.map((competition: any) => (
          <CompetitionCard key={competition.id} data={competition} />
        ))}
      </div>

      {currentCompetitions && currentCompetitions?.length > 0 && (
        <h2 className="my-4 text-2xl font-semibold text-gray-800 dark:text-white">
          Current Competitions{" "}
          <span role="img" aria-label="fire">
            🔥
          </span>
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 xl:grid-cols-4">
        {currentCompetitions.map((competition: any) => (
          <CompetitionCard key={competition.id} data={competition} />
        ))}
      </div>

      {pastCompetitions && pastCompetitions?.length > 0 && (
        <h1 className="my-4 font-cal text-2xl dark:text-white">
          Past Competitions{" "}
          <span role="img" aria-label="fire">
            👏
          </span>
        </h1>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {pastCompetitions.map((competition: any) => (
          <CompetitionCard key={competition.id} data={competition} />
        ))}
      </div>
    </div>
  );
}
