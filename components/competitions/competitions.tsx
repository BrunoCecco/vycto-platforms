import { FC } from "react";
import CompetitionCard from "./competitionCard";
import { SelectCompetition, SelectSite } from "@/lib/schema";

const Competitions = ({
  competitions,
  siteData,
  type,
}: {
  competitions: SelectCompetition[];
  siteData: SelectSite;
  type?: "current" | "past";
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {competitions.map((competition: SelectCompetition, index) => (
        <CompetitionCard
          key={index}
          competition={competition}
          siteData={siteData}
          type={type}
        />
      ))}
    </div>
  );
};

export default Competitions;
