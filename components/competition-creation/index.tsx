"use client";
import { useState } from "react";
import SearchPage from "./searchPage";

const CompetitionCreator = () => {
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState(null);

  const handleSelect = (result: any) => {
    setSelectedPlayerTeam(result);
  };

  return (
    <div className="p-8 pt-12 sm:pt-0">
      <SearchPage />
    </div>
  );
};

export default CompetitionCreator;
