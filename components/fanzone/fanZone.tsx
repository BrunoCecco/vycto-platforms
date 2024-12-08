import { FC, Suspense } from "react";
import Competitions from "@/components/competitions/competitions";
import { competitions, SelectCompetition, SelectSite } from "@/lib/schema";
import FanZoneHeader from "./fanzoneHeader";
import MainLeaderboard from "../leaderboard/mainLeaderboard";
import { ClockIcon, Medal, PlayCircle } from "lucide-react";
import LoadingDots from "../icons/loadingDots";
import Loading from "@/components/ui/loading";
import { Story } from "./story";
import { Spinner } from "@nextui-org/react";
import { Session } from "next-auth";

const FanZone = async ({
  siteData,
  currentCompetitions,
  pastCompetitions,
  latestCompetition,
  session,
}: {
  siteData: SelectSite;
  currentCompetitions: SelectCompetition[];
  pastCompetitions: SelectCompetition[];
  latestCompetition: any;
  session: Session | null;
}) => {
  return (
    <div className="w-full">
      <Suspense fallback={<Loading data={siteData} />}>
        <FanZoneHeader data={siteData} latestCompetition={latestCompetition} />
      </Suspense>
      <h2 className="flex items-center py-6 text-lg font-semibold sm:text-2xl">
        <Medal className="mr-2" style={{ color: siteData.color1 }} />
        Current Competitions
      </h2>
      {currentCompetitions?.length > 0 ? (
        <Suspense fallback={<Spinner />}>
          <Competitions
            competitions={currentCompetitions}
            siteData={siteData}
            type="current"
          />
        </Suspense>
      ) : (
        <h2 className="py-4 text-lg font-semibold italic">
          No current competitions yet. Stay tuned for more! Coming soon! 🔥
        </h2>
      )}
      <h2 className="flex items-center py-6 text-lg font-semibold sm:text-2xl">
        <ClockIcon className="mr-2" style={{ color: siteData.color1 }} />
        Past Competitions
      </h2>
      {pastCompetitions?.length > 0 ? (
        <Suspense fallback={<Spinner />}>
          <Competitions
            competitions={pastCompetitions}
            siteData={siteData}
            type="past"
          />
        </Suspense>
      ) : (
        <h2 className="mb-24 py-4 text-lg font-semibold italic ">
          No past competitions yet. Stay tuned for more! Coming soon! 🔥
        </h2>
      )}
      <div className="my-14" />
      <MainLeaderboard siteData={siteData} session={session} />
    </div>
  );
};

export default FanZone;
