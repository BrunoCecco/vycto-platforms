"use client";

import { FC, use, useEffect, useState } from "react";
import CompetitionCard from "./competitionCard";
import { SelectCompetition, SelectSite } from "@/lib/schema";
import CompetitionModal from "./competitionModal";
import { usePathname } from "next/navigation";
import { Carousel } from "../ui/carousel";

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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedCompetition) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [selectedCompetition]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCompetition(null);
    }
  }, [isOpen]);

  const pathname = usePathname();

  const handleCompetitionClick = (competition: SelectCompetition) => {
    setSelectedCompetition(competition);
  };

  const getStatus = (competition: SelectCompetition) => {
    if (!competition) return;
    const days = Math.ceil(
      (new Date(competition.date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days > 0 ? `${days} Days to go` : `${Math.abs(days)} Days ago`;
  };

  console.log(pathname);

  return (
    <div className="flex w-full">
      <Carousel
        items={competitions.map((competition: SelectCompetition, index) => (
          <CompetitionCard
            key={index}
            competition={competition}
            siteData={siteData}
            type={type}
            onClick={() => handleCompetitionClick(competition)} // Pass click handler
          />
        ))}
      />
      <CompetitionModal
        type={type!}
        siteData={siteData}
        competition={selectedCompetition!}
        isOpen={isOpen}
        setIsOpen={setIsOpen} // Close handler
        status={getStatus(selectedCompetition!)} // Pass status
      />
    </div>
  );
};

export default Competitions;
