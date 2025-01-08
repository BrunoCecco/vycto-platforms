import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import CompetitionWinners from "@/components/competitions/competitionWinners";
import {
  getCompetitionDataWithSite,
  getCompetitionUsers,
  getCompetitionWinnerData,
  getSiteAdmins,
} from "@/lib/fetchers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CompetitionParticipants({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const data = await getCompetitionDataWithSite(decodeURIComponent(params.id));

  if (!data?.site) {
    notFound();
  }

  const siteAdmins = await getSiteAdmins(data?.site.id);

  if (
    !data ||
    (data.userId !== session.user.id &&
      !siteAdmins.find((admin) => admin.email === session.user.email))
  ) {
    notFound();
  }

  const winnerData = await getCompetitionWinnerData(data.id);
  const participants = await getCompetitionUsers(data.id);

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/comp/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/comp/${data.slug}`;

  if (new Date(data.date.replace(/\[.*\]$/, "")).getTime() >= Date.now()) {
    return <div className="my-12">Competition has not ended yet</div>;
  }

  return (
    <div className="flex flex-col space-y-12">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Competition Results</h1>
        <CompetitionWinners
          compData={data}
          winnerData={winnerData}
          participants={participants}
          url={url}
          adminView={true}
        />
      </div>
    </div>
  );
}
