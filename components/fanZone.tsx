import { FC } from "react";
import Competitions from "./competitions";

interface FanZoneProps {
  currentCompetitions: {
    title: string | null;
    sponsor: string | null;
    description: string | null;
    slug: string;
    image: string | null;
    imageBlurhash: string | null;
    createdAt: Date;
    date: string;
  }[];
  pastCompetitions: {
    title: string | null;
    sponsor: string | null;
    description: string | null;
    slug: string;
    image: string | null;
    imageBlurhash: string | null;
    createdAt: Date;
    date: string;
  }[];
}

const FanZone: FC<FanZoneProps> = ({
  currentCompetitions,
  pastCompetitions,
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
