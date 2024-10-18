import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import CompetitionWinners from "@/components/competitions/competitionWinners";
import { getCompetitionWinnerData } from "@/lib/fetchers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CompetitionResults({
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

  const winnerData = await getCompetitionWinnerData(data.id);

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/comp/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/comp/${data.slug}`;

  if (new Date(data.date).getTime() >= Date.now()) {
    return <div className="my-12">Competition has not ended yet</div>;
  }

  return (
    <div className="flex  flex-col space-y-12 p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Competition Results
        </h1>
        <CompetitionWinners
          winnerData={winnerData}
          url={url}
          adminView={true}
        />
      </div>
    </div>
  );
}
