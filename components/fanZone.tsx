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
      {currentCompetitions?.length > 0 ? (
        <Competitions competitions={currentCompetitions} />
      ) : (
        <h2 className="py-4 text-lg font-semibold text-gray-600">
          No competitions yet...
        </h2>
      )}
      <h2 className="py-10 text-2xl font-semibold text-gray-800">
        Past Competitions{" "}
        <span role="img" aria-label="fire">
          👏
        </span>
      </h2>
      {pastCompetitions?.length > 0 ? (
        <Competitions competitions={pastCompetitions} />
      ) : (
        <h2 className="py-4 text-lg font-semibold text-gray-600">
          No past competitions yet... stay tuned for more!
        </h2>
      )}
    </>
  );
};

export default FanZone;
