import { FC } from "react";
import CompetitionCard from "./competitionCard";
import { SelectCompetition } from "@/lib/schema";

const Competitions = ({
  competitions,
}: {
  competitions: SelectCompetition[];
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row md:space-x-4 md:space-y-0">
      {competitions.map((competition: SelectCompetition, index) => (
        <CompetitionCard key={index} competition={competition} />
      ))}
    </div>
  );
};

export default Competitions;
