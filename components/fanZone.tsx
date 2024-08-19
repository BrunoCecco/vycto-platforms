import { FC } from "react";
import Competitions from "./competitions";
import { competitions, SelectCompetition, SelectSite } from "@/lib/schema";

const FanZone = ({
  siteData,
  currentCompetitions,
  pastCompetitions,
}: {
  siteData: SelectSite;
  currentCompetitions: SelectCompetition[];
  pastCompetitions: SelectCompetition[];
}) => {
  return (
    <>
      {currentCompetitions?.length > 0 && (
        <h2 className="py-4 text-2xl font-semibold text-gray-800">
          Current Competitions{" "}
          <span role="img" aria-label="fire">
            🔥
          </span>
        </h2>
      )}
      <Competitions competitions={currentCompetitions} />
      {pastCompetitions?.length > 0 && (
        <h2 className="py-4 text-2xl font-semibold text-gray-800">
          Past Competitions{" "}
          <span role="img" aria-label="fire">
            👏
          </span>
        </h2>
      )}
      <Competitions competitions={pastCompetitions} />
    </>
  );
};

export default FanZone;
