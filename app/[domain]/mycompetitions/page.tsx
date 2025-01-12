import Competitions from "@/components/competitions/competitions";
import Predictions from "@/components/my-competitions/predictions";
import ProfileBanner from "@/components/my-competitions/profileBanner";
import TopPredictions from "@/components/my-competitions/toppredictions";
import { authOptions } from "@/lib/auth";
import {
  getCompetitionsForSite,
  getSiteData,
  getTopPredictions,
  getUserCompetitions,
  getUserData,
} from "@/lib/fetchers";
import { SelectCompetition, SelectUserCompetition } from "@/lib/schema";
import { ClockIcon, MedalIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations();

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

  const predictions = await getTopPredictions(session.user.id, data.id);

  return (
    <div className="min-h-screen">
      {/* Main Container */}
      <div className="mx-auto pt-3">
        <div className="flex flex-col gap-8">
          <div className="text-2xl">{t("mycompetitions")}</div>
          <ProfileBanner user={user} siteData={data} />
          {/* Right Stats and Top Predictions */}
          <div className="w-full">
            {predictions && predictions?.length > 0 && (
              <div className="mb-12 w-full">
                <h1 className="mb-4 flex items-center text-lg font-semibold sm:text-2xl">
                  <MedalIcon color={data.color1} size={24} className="mr-2" />
                  Top Predictions
                </h1>
                <TopPredictions
                  compData={compData.map((comp) => comp.competition)}
                  predictions={predictions}
                />
              </div>
            )}
            {userCompetitions && userCompetitions?.length == 0 && (
              <div className="text-center text-lg">
                No competitions found. Please enter a competition to get
                started.
              </div>
            )}
            {currentCompetitions && currentCompetitions?.length > 0 && (
              <div className="mb-12 w-full">
                <h1 className="mb-4 flex items-center text-lg font-semibold sm:text-2xl">
                  <MedalIcon color={data.color1} size={24} className="mr-2" />
                  {t("currentcompetitions")}
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
                <h1 className="mb-4 flex items-center text-lg font-semibold sm:text-2xl">
                  <ClockIcon color={data.color1} size={24} className="mr-2" />
                  {t("pastcompetitions")}
                </h1>
                <Predictions
                  competitions={pastCompetitions
                    .reverse()
                    .map((comp) => comp.userComp)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
