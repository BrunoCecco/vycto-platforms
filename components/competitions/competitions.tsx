"use client";

import { FC, use, useEffect, useState } from "react";
import CompetitionCard from "./competitionCard";
import {
  SelectCompetition,
  SelectSite,
  SelectUserCompetition,
} from "@/lib/schema";
import CompetitionModal from "./competitionModal";
import { usePathname } from "next/navigation";
import { Carousel } from "../ui/carousel";
import { getQuestionsForCompetition } from "@/lib/fetchers";

const Competitions = ({
  competitions,
  siteData,
  userCompetitions,
  type,
}: {
  competitions: SelectCompetition[];
  siteData: SelectSite;
  userCompetitions?: SelectUserCompetition[];
  type?: "current" | "past";
}) => {
  const [selectedCompetition, setSelectedCompetition] =
    useState<SelectCompetition | null>(null);
  const [selectedCompetitionQuestions, setSelectedCompetitionQuestions] =
    useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (selectedCompetition) {
      setIsOpen(true);
      fetchQuestions(selectedCompetition);
    } else {
      setIsOpen(false);
      setSelectedCompetitionQuestions(0);
    }
  }, [selectedCompetition]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCompetition(null);
    }
  }, [isOpen]);

  const pathname = usePathname();

  const fetchQuestions = async (competition: SelectCompetition) => {
    const qs = await getQuestionsForCompetition(competition.id);
    setSelectedCompetitionQuestions(qs.length);
  };

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

  return (
    <div className="flex w-full">
      <Carousel
        items={competitions.map((competition: SelectCompetition, index) => {
          console.log(
            userCompetitions?.find((uc) => uc.competitionId == competition.id),
          );
          return (
            <CompetitionCard
              key={index}
              competition={competition}
              siteData={siteData}
              type={type}
              played={userCompetitions?.some(
                (uc) => uc.competitionId == competition.id && uc.submitted,
              )}
              onClick={() => handleCompetitionClick(competition)} // Pass click handler
            />
          );
        })}
      />
      <CompetitionModal
        type={type!}
        siteData={siteData}
        competition={selectedCompetition!}
        numQuestions={selectedCompetitionQuestions}
        isOpen={isOpen}
        setIsOpen={setIsOpen} // Close handler
        status={getStatus(selectedCompetition!)} // Pass status
      />
    </div>
  );
};

export default Competitions;
