"use client";
import { useState } from "react";
import Search from "./search";
import QuestionGenerator from "./questionGenerator";

const CompetitionCreator = () => {
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState(null);

  const handleSelect = (result: any) => {
    setSelectedPlayerTeam(result);
  };

  return (
    <div className="p-8 pt-12 sm:pt-0">
      <h1 className="mb-2 text-xl">Competition Creator</h1>
      <Search onSelect={handleSelect} />
      <QuestionGenerator selected={selectedPlayerTeam} />
    </div>
  );
};

export default CompetitionCreator;
