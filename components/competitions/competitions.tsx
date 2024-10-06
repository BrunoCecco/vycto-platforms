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
    <div className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth">
      <div className="flex flex-row justify-start gap-4">
        {competitions.map((competition: SelectCompetition, index) => (
          <CompetitionCard
            key={index}
            competition={competition}
            siteData={siteData}
            type={type}
          />
        ))}
      </div>
    </div>
  );
};

export default Competitions;
