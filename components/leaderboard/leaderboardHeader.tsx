import React, { useState } from "react";
import { SelectSite, SelectSiteReward } from "@/lib/schema";
import { Crown, SearchIcon } from "lucide-react";
import { Select, SelectItem, Input } from "@nextui-org/react";
import { LeaderboardPeriod } from "@/lib/types";
import Image from "next/image";

const LeaderboardHeader = ({
  siteData,
  rangeType,
  setRangeType,
  setQuery,
  selectedReward,
  onClick,
  compTitle,
  isComp,
}: {
  siteData: SelectSite;
  rangeType: LeaderboardPeriod;
  setRangeType: any;
  setQuery?: any;
  selectedReward?: SelectSiteReward;
  onClick?: any;
  compTitle?: string;
  isComp?: boolean;
}) => {
  const timeRanges = [
    { key: "last week", label: "Last Week" },
    { key: "monthly", label: "Monthly" },
    { key: "season", label: "Season" },
    // { key: "all time", label: "All Time" },
  ];

  // Function to dynamically set the prize text based on rangeType
  const getPrizeText = () => {
    if (rangeType === "all time") {
      return "Season Prizes";
    } else if (rangeType === "monthly") {
      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
      });
      return `${currentMonth}'s Prizes`; // e.g., "December's Prize"
    } else if (rangeType === "season") {
      return "Season's Prizes";
    }
    return "";
  };

  return (
    <div className="mb-2 flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex w-full flex-wrap items-center justify-between gap-4 sm:flex-col md:items-start">
        {isComp ? null : (
          <div className="flex items-center gap-4 sm:mt-2">
            <Image
              src={selectedReward?.image || siteData.logo || "/logo.png"}
              height={48}
              width={48}
              className="w-auto object-contain"
              alt="logo"
            />
            <h1 className="text-lg font-bold">
              Leaderboard{" "}
              {rangeType === "monthly"
                ? new Date().toLocaleString("default", { month: "long" })
                : rangeType === "season"
                  ? new Date().getFullYear()
                  : compTitle
                    ? `: ${compTitle}`
                    : " "}
            </h1>
          </div>
        )}

        {/* Updated text based on rangeType */}
        {isComp ? null : (
          <div
            className="cursor-pointer underline"
            style={{ color: siteData.color2 }}
            onClick={onClick}
          >
            {getPrizeText()}
          </div>
        )}
      </div>
      <div className="flex w-full gap-4">
        <Input
          placeholder="Search..."
          onValueChange={setQuery}
          startContent={<SearchIcon size={18} />}
          type="search"
        />
        {isComp ? null : (
          <Select
            aria-label="Time Range"
            placeholder={rangeType}
            selectedKeys={[rangeType]}
            variant="flat"
            className="max-w-xs"
            onChange={setRangeType}
          >
            {timeRanges.map((range) => (
              <SelectItem key={range.key}>{range.label}</SelectItem>
            ))}
          </Select>
        )}
      </div>
    </div>
  );
};

export default LeaderboardHeader;
