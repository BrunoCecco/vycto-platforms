import { FC } from "react";
import Competitions from "@/components/competitions/competitions";
import { competitions, SelectCompetition, SelectSite } from "@/lib/schema";
import FanZoneHeader from "./fanzoneHeader";
import MainLeaderboard from "../leaderboard/mainLeaderboard";

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
      <h2 className="py-10 text-2xl font-semibold text-gray-800">
        Current Competitions{" "}
        <span role="img" aria-label="fire">
          🔥
        </span>
      </h2>
      {currentCompetitions?.length > 0 ? (
        <Competitions
          competitions={currentCompetitions}
          siteData={siteData}
          type="current"
        />
      ) : (
        <h2 className="py-4 text-lg font-semibold italic text-gray-600">
          No current competitions yet. Stay tuned for more! Coming soon! 🔥
        </h2>
      )}
      <h2 className="mt-6 py-10 text-2xl font-semibold text-gray-800">
        Past Competitions{" "}
        <span role="img" aria-label="fire">
          👏
        </span>
      </h2>
      {pastCompetitions?.length > 0 ? (
        <Competitions
          competitions={pastCompetitions}
          siteData={siteData}
          type="past"
        />
      ) : (
        <h2 className="mb-24 py-4 text-lg font-semibold italic text-gray-600">
          No past competitions yet. Stay tuned for more! Coming soon! 🔥
        </h2>
      )}
      <div className="my-10" />
      <MainLeaderboard siteData={siteData} />
    </div>
  );
};

export default FanZone;
