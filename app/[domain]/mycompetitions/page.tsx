import Predictions from "@/components/my-competitions/predictions";
import { authOptions } from "@/lib/auth";
import {
  getCompetitionsForSite,
  getSiteData,
  getUserCompetitions,
} from "@/lib/fetchers";
import { SelectUserCompetition } from "@/lib/schema";
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

  const domain = decodeURIComponent(params.domain);
  const [data, compData] = await Promise.all([
    getSiteData(domain),
    getCompetitionsForSite(domain),
  ]);

  // const competitions = compData.map(
  //   (competition: any) => competition.competition,
  // );

  if (!data) {
    notFound();
  }

  const userCompetitions = await getUserCompetitions(session.user.id);

  console.log(userCompetitions, "comps");

  const currentCompetitions = userCompetitions.filter(
    (comp: SelectUserCompetition) => new Date(comp.submissionDate) > new Date(),
  );

  const pastCompetitions = userCompetitions.filter(
    (comp: SelectUserCompetition) => new Date(comp.submissionDate) < new Date(),
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Container */}
      <div className="mx-auto max-w-7xl pt-3">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Profile Card with Sticky Position */}
          {/* <div className="w-full self-start lg:sticky lg:top-12 lg:w-1/3">
            <ProfileCard />
          </div> */}

          {/* Right Stats and Top Predictions */}
          <div className="w-full">
            {/* <PredictionStats /> */}
            <div className="w-full">
              <Predictions
                competitions={currentCompetitions}
                title={"Current Predictions"}
              />
            </div>
            <div className="mt-12 w-full">
              <Predictions
                competitions={pastCompetitions}
                title={"Past Predictions"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
