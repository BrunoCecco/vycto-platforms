import { FC } from "react";
import CompetitionCard from "./competitionCard";
import { SelectCompetition } from "@/lib/schema";

const Competitions = ({
  competitions,
}: {
  competitions: SelectCompetition[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {competitions.map((competition: SelectCompetition, index) => (
        <CompetitionCard key={index} competition={competition} />
      ))}
    </div>
  );
};

export default Competitions;
