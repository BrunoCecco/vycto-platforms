import React from "react";
import { SelectSite } from "@/lib/schema";
import { Crown } from "lucide-react";
import { Select, SelectItem, TextInput } from "@tremor/react";
import { LeaderboardPeriod } from "@/lib/types";
import Image from "next/image";

const LeaderboardHeader = ({
  siteData,
  rangeType,
  setRangeType,
  setQuery,
}: {
  siteData: SelectSite;
  rangeType: LeaderboardPeriod;
  setRangeType: any;
  setQuery?: any;
}) => {
  const timeRanges = ["Last Week", "Monthly", "Season", "All Time"];

  // Function to dynamically set the prize text based on rangeType
  const getPrizeText = () => {
    if (rangeType === "last week") {
      return "Last Week's Prizes";
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
    <div className="mb-2 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center justify-between sm:flex-col md:items-start">
        <div className="flex items-center gap-4 sm:mt-2">
          <Image
            src={siteData.logo ?? "/logo.png"}
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
                : " "}
          </h1>
        </div>
        {/* Updated text based on rangeType */}
        <p
          className="cursor-pointer underline"
          style={{ color: siteData.color1 }}
        >
          {getPrizeText()}
        </p>
      </div>
      <div className="flex gap-4">
        <TextInput placeholder="Search" onValueChange={setQuery} />
        <Select
          value={rangeType}
          onValueChange={(value) => setRangeType(value)}
          className="w-min"
        >
          {timeRanges.map((range) => (
            <SelectItem
              key={range}
              value={range.toLowerCase()}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
            >
              {range}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
