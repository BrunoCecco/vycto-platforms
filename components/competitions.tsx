import { FC } from "react";
import CompetitionCard from "./competitionCard";

interface Competition {
  title: string | null;
  sponsor: string | null;
  description: string | null;
  slug: string;
  image: string | null;
  imageBlurhash: string | null;
  createdAt: Date;
  startDate: string;
  endDate: string;
}

interface CompetitionsProps {
  competitions: Competition[];
}

const Competitions: FC<CompetitionsProps> = ({ competitions }) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row md:space-x-4 md:space-y-0">
      {competitions.map((competition, index) => (
        <CompetitionCard key={index} {...competition} />
      ))}
    </div>
  );
};

export default Competitions;
