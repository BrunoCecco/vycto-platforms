import { FC } from "react";
import CompetitionCard from "./competitionCard";
import { SelectCompetition, SelectSite } from "@/lib/schema";

const Competitions = ({
  competitions,
  siteData,
}: {
  competitions: SelectCompetition[];
  siteData: SelectSite;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {competitions.map((competition: SelectCompetition, index) => (
        <CompetitionCard
          key={index}
          competition={competition}
          siteData={siteData}
        />
      ))}
    </div>
  );
};

export default Competitions;
