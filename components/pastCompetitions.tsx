import { FC } from "react";
import CompetitionCard from "./competitionCard";

interface Competition {
  imageSrc: string;
  title: string;
  sponsor: string;
  statusInfo: string;
}

interface PastCompetitionsProps {
  competitions: Competition[];
}

const PastCompetitions: FC<PastCompetitionsProps> = ({ competitions }) => {
  return (
    <div className="md:px-8">
      <h2 className="py-4 text-2xl font-semibold text-gray-800">
        Past Competitions{" "}
        <span role="img" aria-label="fire">
          👏
        </span>
      </h2>
      <div className="flex flex-col space-y-4 sm:flex-row md:space-x-4 md:space-y-0">
        {competitions.map((competition, index) => (
          <CompetitionCard
            key={index}
            imageSrc={competition.imageSrc}
            title={competition.title}
            sponsor={competition.sponsor}
            statusInfo={competition.statusInfo}
          />
        ))}
      </div>
    </div>
  );
};

export default PastCompetitions;
