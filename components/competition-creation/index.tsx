"use client";
import { useState } from "react";
import SearchPage from "./searchPage";

const CompetitionCreator = ({
  siteId,
  compId,
}: {
  siteId: string;
  compId: string;
}) => {
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState(null);

  const handleSelect = (result: any) => {
    setSelectedPlayerTeam(result);
  };

  return (
    <div className="p-8 pt-12 sm:pt-0">
      <SearchPage siteId={siteId} compId={compId} />
    </div>
  );
};

export default CompetitionCreator;
