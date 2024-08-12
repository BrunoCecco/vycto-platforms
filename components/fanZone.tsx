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
    startDate: string;
    endDate: string;
  }[];
  pastCompetitions: {
    title: string | null;
    sponsor: string | null;
    description: string | null;
    slug: string;
    image: string | null;
    imageBlurhash: string | null;
    createdAt: Date;
    startDate: string;
    endDate: string;
  }[];
}

const FanZone: FC<FanZoneProps> = ({
  currentCompetitions,
  pastCompetitions,
}) => {
  return (
    <>
      <h2 className="py-4 text-2xl font-semibold text-gray-800">
        Current Competitions{" "}
        <span role="img" aria-label="fire">
          🔥
        </span>
      </h2>
      <Competitions competitions={currentCompetitions} />
      <h2 className="py-4 text-2xl font-semibold text-gray-800">
        Past Competitions{" "}
        <span role="img" aria-label="fire">
          👏
        </span>
      </h2>
      <Competitions competitions={pastCompetitions} />
    </>
  );
};

export default FanZone;
