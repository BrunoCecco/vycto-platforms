import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SelectSite } from "@/lib/schema";
import { Crown } from "lucide-react";
import { Button, Select, SelectItem } from "@tremor/react";

const LeaderboardHeader = ({
  siteData,
  rangeType,
  setRangeType,
}: {
  siteData: SelectSite;
  rangeType: string;
  setRangeType: any;
}) => {
  const timeRanges = ["Monthly", "Yearly", "All Time"];

  return (
    <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <Crown style={{ color: siteData.color1 }} />
        <h1 className="text-lg font-bold">
          Leaderboard{" "}
          {rangeType == "monthly"
            ? new Date().toLocaleString("default", { month: "long" })
            : rangeType == "yearly"
              ? new Date().getFullYear()
              : " "}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Select
          value={rangeType}
          onValueChange={(value) => setRangeType(value)}
          className="w-min"
        >
          {timeRanges.map((range) => (
            <SelectItem key={range} value={range.toLowerCase()}>
              {range}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
