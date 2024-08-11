import { FC } from "react";
import CompetitionCard from "./competitionCard"; // Assuming your CompetitionCard is in the same directory

const CurrentCompetitions: FC = () => {
  const competitions = [
    {
      imageSrc: "/atletiCurrent.jpg",
      title: "Atletico vs Inter",
      sponsor: "Tanqueray",
      statusInfo: "24 hours left",
    },
    {
      imageSrc: "/atletiCurrent.jpg",
      title: "Atletico vs Athletic",
      sponsor: "Tanqueray",
      statusInfo: "24 hours left",
    },
    // Add more competition objects here if needed
  ];

  return (
    <div className="md:px-8">
      <h2 className="py-4 text-2xl font-semibold text-gray-800">
        Current Competitions{" "}
        <span role="img" aria-label="fire">
          🔥
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

export default CurrentCompetitions;
