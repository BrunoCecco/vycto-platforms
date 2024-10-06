import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import QuestionEditor from "@/components/edit-competition/questionEditor";
import db from "@/lib/db";
import { getCompetitionData, getQuestionsForCompetition } from "@/lib/fetchers";
import CompetitionCreator from "@/components/competition-creation";
import Button from "@/components/buttons/button";
import EditCompetitionDetails from "@/components/edit-competition/editCompetitionDetails";

export default async function CompetitionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
    console.log("HERE");
  }

  const competitionData = await db.query.competitions.findFirst({
    where: (competitions, { eq }) =>
      eq(competitions.id, decodeURIComponent(params.id)),
    with: {
      site: true,
    },
  });

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
