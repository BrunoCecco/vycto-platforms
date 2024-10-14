import { notFound, redirect } from "next/navigation";
import {
  getAnswersForUser,
  getCompetitionData,
  getCompetitionUsers,
  getQuestionsForCompetition,
  getSiteData,
  getUserCompetitions,
  getUserData,
  getUserDataById,
} from "@/lib/fetchers";
import db from "@/lib/db";
import {
  competitions,
  SelectQuestion,
  SelectUserCompetition,
  sites,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  answerQuestion,
  enterUserToCompetition,
  submitAnswers,
} from "@/lib/actions";
import { getSession } from "@/lib/auth";
import CompetitionPage from "@/components/competitions/competitionPage";
import UserCompetitionInfo from "@/components/competitions/userCompetitionInfo";

export default async function UserCompetitionsPage({
  params,
}: {
  params: { domain: string; userId: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const userId = decodeURIComponent(params.userId);
  const user = await getUserDataById(userId);
  const competitions = await getUserCompetitions(userId);

  if (!competitions) {
    notFound();
  }

  return (
    <div className="">
      <h1 className="mb-4 text-lg font-bold">
        {user?.username || user?.name} competitions
      </h1>
      {competitions &&
        competitions.map((comp: SelectUserCompetition) => (
          <UserCompetitionInfo key={comp.competitionId} userComp={comp} />
        ))}
    </div>
  );
}
