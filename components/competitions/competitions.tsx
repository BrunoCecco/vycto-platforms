"use client";

import { FC, useEffect, useState } from "react";
import CompetitionCard from "./competitionCard";
import { SelectCompetition, SelectSite } from "@/lib/schema";
import CompetitionModal from "./competitionModal";

const Competitions = ({
  competitions,
  siteData,
  type,
}: {
  competitions: SelectCompetition[];
  siteData: SelectSite;
  type?: "current" | "past";
}) => {
  const [selectedCompetition, setSelectedCompetition] =
    useState<SelectCompetition | null>(null);

  const handleCompetitionClick = (competition: SelectCompetition) => {
    setSelectedCompetition(competition);
  };

  const getStatus = (competition: SelectCompetition) => {
    const days = Math.ceil(
      (new Date(competition.date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days > 0 ? `${days} Days to go` : `${Math.abs(days)} Days ago`;
  };

  return (
    <div className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth">
      <div className="flex flex-row justify-start gap-4">
        {competitions.map((competition: SelectCompetition, index) => (
          <CompetitionCard
            key={index}
            competition={competition}
            siteData={siteData}
            type={type}
            onClick={() => handleCompetitionClick(competition)} // Pass click handler
          />
        ))}
      </div>
      {selectedCompetition && (
        <CompetitionModal
          type={type!}
          siteData={siteData}
          competition={selectedCompetition}
          onClose={() => setSelectedCompetition(null)} // Close handler
          status={getStatus(selectedCompetition)} // Pass status
        />
      )}
    </div>
  );
};

export default Competitions;
