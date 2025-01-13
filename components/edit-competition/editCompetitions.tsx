"use server";
import db from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import CompetitionCard from "./editCompetitionCard";
import CreateCompetitionButton from "./createCompetitionButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { or } from "drizzle-orm";
import { getAdminCompetitions, getCompetitionUsers } from "@/lib/fetchers";
import DraftedCompetitions from "./draftedCompetitions";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";

export default async function EditCompetitions({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const competitions = await getAdminCompetitions(
    session.user.email,
    siteId,
    limit,
  );

  if (!competitions) {
    return null;
  }

  console.log("Competitions: ", competitions);

  const pastCompetitions = competitions.filter(
    (competition: any) =>
      new Date(competition.date?.replace(/\[.*\]$/, "")).getTime() <
        Date.now() && competition.published,
  );

  const currentCompetitions = competitions.filter(
    (competition: any) =>
      new Date(competition.date?.replace(/\[.*\]$/, "")).getTime() >=
        Date.now() && competition.published,
  );

  const draftedCompetitions = competitions.filter(
    (competition: any) => !competition.published,
  );

  return (
    <div className="mt-10">
      {draftedCompetitions && draftedCompetitions?.length > 0 && (
        <h1 className="my-4 text-2xl ">Drafted Competitions</h1>
      )}
      <DraftedCompetitions data={draftedCompetitions} />

      {currentCompetitions && currentCompetitions?.length > 0 && (
        <h2 className="my-4 text-2xl">
          Current Competitions{" "}
          <span role="img" aria-label="fire">
            🔥
          </span>
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 xl:grid-cols-4">
        {currentCompetitions.reverse().map(async (competition: any) => {
          const users = await getCompetitionUsers(competition.id);
          return (
            <CompetitionCard
              key={competition.id}
              data={competition}
              users={users}
            />
          );
        })}
      </div>

      {pastCompetitions && pastCompetitions?.length > 0 && (
        <h1 className="my-4 text-2xl">
          Past Competitions{" "}
          <span role="img" aria-label="fire">
            👏
          </span>
        </h1>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {pastCompetitions.map(async (competition: any) => {
          const users = await getCompetitionUsers(competition.id);
          return (
            <CompetitionCard
              key={competition.id}
              data={competition}
              users={users}
            />
          );
        })}
      </div>
    </div>
  );
}
