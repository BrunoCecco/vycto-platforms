"use client";
import { MONTHS } from "@/lib/constants";
import { SelectSite, SelectSiteReward } from "@/lib/schema";
import CreateSiteReward from "../modal/createSiteReward";
import SiteReward from "./siteReward";
import { useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";

export default function SiteRewardsPage({
  data,
  rewards,
}: {
  data: SelectSite;
  rewards: SelectSiteReward[];
}) {
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[0].value.toString(),
  );
  const [selectedReward, setSelectedReward] = useState<SelectSiteReward>();

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    setSelectedReward(
      rewards.find((reward) => reward.month === parseInt(e.target.value)),
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
        onChange={handleSelectionChange}
      >
        {MONTHS.map((month) => (
          <SelectItem key={month.value.toString()}>{month.label}</SelectItem>
        ))}
      </Select>
      {selectedReward ? (
        <SiteReward
          month={MONTHS.find((m) => m.value === parseInt(selectedMonth))}
          data={data}
          reward={selectedReward}
        />
      ) : (
        <div key={selectedMonth}>
          <div className="mb-2 text-lg font-bold">
            {MONTHS.find((m) => m.value === parseInt(selectedMonth))?.label}
          </div>
          <CreateSiteReward
            siteId={data.id}
            month={
              MONTHS.find((m) => m.value === parseInt(selectedMonth))?.value ||
              1
            }
            year={new Date().getFullYear()}
          />
        </div>
      )}
    </div>
  );
}
