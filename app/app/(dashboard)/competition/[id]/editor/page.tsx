import { notFound, redirect } from "next/navigation";
import QuestionEditor from "@/components/edit-competition/questionEditor";
import db from "@/lib/db";
import {
  getCompetitionData,
  getQuestionsForCompetition,
  getCompetitionDataWithSite,
} from "@/lib/fetchers";
import CompetitionCreator from "@/components/competition-creation";
import EditCompetitionDetails from "@/components/edit-competition/editCompetitionDetails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SelectQuestion } from "@/lib/schema";

export default async function CompetitionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const competitionData = await getCompetitionDataWithSite(
    decodeURIComponent(params.id),
  );

  if (
    !competitionData ||
    (competitionData.userId !== session.user.id &&
      competitionData.admin != session.user.email)
  ) {
    notFound();
  }

  const initialQuestions = await getQuestionsForCompetition(competitionData.id);

  return (
    <div>
      <EditCompetitionDetails data={competitionData} />
      <QuestionEditor
        competition={competitionData}
        initialQuestions={initialQuestions}
      />
    </div>
  );
}
