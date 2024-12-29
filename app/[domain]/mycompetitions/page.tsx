import Competitions from "@/components/competitions/competitions";
import Predictions from "@/components/my-competitions/predictions";
import ProfileBanner from "@/components/my-competitions/profileBanner";
import { authOptions } from "@/lib/auth";
import {
  getCompetitionsForSite,
  getSiteData,
  getUserCompetitions,
  getUserData,
} from "@/lib/fetchers";
import { SelectCompetition, SelectUserCompetition } from "@/lib/schema";
import { ClockIcon, MedalIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

export default async function MyCompetitions({
  params,
}: {
  params: { domain: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await getUserData(session.user.email);

  if (!user) {
    notFound();
  }

  const domain = decodeURIComponent(params.domain);
  const [data, compData] = await Promise.all([
    getSiteData(domain),
    getCompetitionsForSite(domain),
  ]);

  if (!data) {
    notFound();
  }

  const userCompetitions = await getUserCompetitions(session.user.id, data.id);
  console.log(userCompetitions, "userCompetitions");

  const currentCompetitions = userCompetitions.filter((comp) => {
    const compDate = comp.competition?.date
      ? new Date(comp.competition.date.replace(/\[.*\]$/, ""))
      : null;
    return compDate && compDate >= new Date();
  });

  const pastCompetitions = userCompetitions.filter((comp) => {
    const compDate = comp.competition?.date
      ? new Date(comp.competition.date.replace(/\[.*\]$/, ""))
      : null;
    return compDate && compDate < new Date();
  });

  return (
    <div className="min-h-screen">
      {/* Main Container */}
      <div className="mx-auto pt-3">
        <div className="flex flex-col gap-8">
          <div className="text-2xl">My Competitions</div>
          <ProfileBanner user={user} siteData={data} />
          {/* Right Stats and Top Predictions */}
          <div className="w-full">
            {currentCompetitions && currentCompetitions?.length > 0 && (
              <div className="mb-12 w-full">
                <h1 className="mb-4 flex items-center text-2xl font-semibold">
                  <MedalIcon color={data.color1} size={24} className="mr-2" />
                  Current Competitions
                </h1>
                <Predictions
                  competitions={currentCompetitions.map(
                    (comp) => comp.userComp,
                  )}
                />
              </div>
            )}
            {pastCompetitions && pastCompetitions?.length > 0 && (
              <div className="w-full">
                <h1 className="mb-4 flex items-center text-2xl font-semibold">
                  <ClockIcon color={data.color1} size={24} className="mr-2" />
                  Past Competitions
                </h1>
                <Predictions
                  competitions={pastCompetitions.map((comp) => comp.userComp)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
