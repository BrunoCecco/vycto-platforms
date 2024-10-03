import { FC } from "react";
import Competitions from "@/components/competitions/competitions";
import { competitions, SelectCompetition, SelectSite } from "@/lib/schema";
import FanZoneHeader from "./fanzoneHeader";
import MainLeaderboard from "../leaderboard/mainLeaderboard";
import { ClockIcon, PlayCircle } from "lucide-react";

const FanZone = async ({
  siteData,
  currentCompetitions,
  pastCompetitions,
  latestCompetition,
}: {
  siteData: SelectSite;
  currentCompetitions: SelectCompetition[];
  pastCompetitions: SelectCompetition[];
  latestCompetition: any;
}) => {
  return (
    <div className="w-full">
      <FanZoneHeader data={siteData} latestCompetition={latestCompetition} />
      <h2 className="mt-6 flex items-center py-2 text-lg font-semibold text-white sm:py-6 sm:text-2xl">
        <PlayCircle className="mr-2" />
        Current Competitions
      </h2>
      {currentCompetitions?.length > 0 ? (
        <Competitions
          competitions={currentCompetitions}
          siteData={siteData}
          type="current"
        />
      ) : (
        <h2 className="py-4 text-lg font-semibold italic text-slate-200">
          No current competitions yet. Stay tuned for more! Coming soon! 🔥
        </h2>
      )}
      <h2 className="mt-6 flex items-center py-2 text-lg font-semibold text-white sm:py-6 sm:text-2xl">
        <ClockIcon className="mr-2" />
        Past Competitions
      </h2>
      {pastCompetitions?.length > 0 ? (
        <Competitions
          competitions={pastCompetitions}
          siteData={siteData}
          type="past"
        />
      ) : (
        <h2 className="mb-24 py-4 text-lg font-semibold italic text-slate-200">
          No past competitions yet. Stay tuned for more! Coming soon! 🔥
        </h2>
      )}
      <div className="my-10" />
      <MainLeaderboard siteData={siteData} />
    </div>
  );
};

export default FanZone;
