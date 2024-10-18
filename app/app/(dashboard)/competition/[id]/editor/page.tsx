import { notFound, redirect } from "next/navigation";
import QuestionEditor from "@/components/edit-competition/questionEditor";
import db from "@/lib/db";
import { getCompetitionData, getQuestionsForCompetition } from "@/lib/fetchers";
import CompetitionCreator from "@/components/competition-creation";
import EditCompetitionDetails from "@/components/edit-competition/editCompetitionDetails";
import { getServerSession } from "next-auth";

export default async function CompetitionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
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
