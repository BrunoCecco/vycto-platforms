import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/old-components/editor";
import db from "@/lib/db";
import { getQuestionsForCompetition } from "@/lib/fetchers";
import CompetitionCreator from "@/components/competition-creation";
import Button from "@/components/button";

export default async function CompetitionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
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

  const initialQuestions = await getQuestionsForCompetition(data.id);

  return (
    <div>
      {new Date(data?.date).getTime() < Date.now() && (
        <div className="my-6 flex w-fit flex-col rounded-lg bg-white p-2 px-4 shadow-md">
          <div className="rounded-md font-cal text-xl font-bold">
            Time to submit the correct answers for this competition!
          </div>
        </div>
      )}
      <Editor competition={data} initialQuestions={initialQuestions} />
    </div>
  );
}
