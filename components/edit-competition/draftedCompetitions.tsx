"use client";
import { MONTHS } from "@/lib/constants";
import { SelectCompetition } from "@/lib/schema";
import { Select, SelectItem } from "@nextui-org/react";
import CreateCompetitionButton from "./createCompetitionButton";
import CompetitionCard from "./editCompetitionCard";
import { useEffect, useState } from "react";
import router from "next/navigation";

const DraftedCompetitions = ({ data }: { data: SelectCompetition[] }) => {
  const [draftedCompetitions, setDraftedCompetitions] =
    useState<SelectCompetition[]>();
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[0].value.toString(),
  );

  useEffect(() => {
    setDraftedCompetitions(
      fetchCompetitionsByMonth(parseInt(selectedMonth) - 1),
    );
  }, [selectedMonth, data]);

  const fetchCompetitionsByMonth = (month: number) => {
    if (month === -1) return data;
    return data.filter(
      (competition) =>
        new Date(competition.date?.replace(/\[.*\]$/, "")).getMonth() === month,
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Select
        className="max-w-xs"
        label="Select a month"
        placeholder="Select a month"
        selectedKeys={[selectedMonth]}
        variant="bordered"
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {MONTHS.map((month) => (
          <SelectItem
            key={month.value.toString()}
            value={month.value.toString()}
          >
            {month.label}
          </SelectItem>
        ))}
      </Select>
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 xl:grid-cols-4">
        <CreateCompetitionButton />
        {draftedCompetitions &&
          draftedCompetitions?.map((competition: any) => (
            <CompetitionCard key={competition.id} data={competition} />
          ))}
      </div>
    </div>
  );
};

export default DraftedCompetitions;
