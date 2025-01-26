import React, { useState } from "react";
import { SelectSite, SelectSiteReward } from "@/lib/schema";
import { Crown, SearchIcon } from "lucide-react";
import { Select, SelectItem, Input } from "@nextui-org/react";
import { LeaderboardPeriod } from "@/lib/types";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  const timeRanges = [
    { key: LeaderboardPeriod.Weekly, label: t("lastweek") },
    { key: LeaderboardPeriod.Monthly, label: t("monthly") },
    { key: LeaderboardPeriod.Season, label: t("season") },
    // { key: LeaderboardPeriod.All, label: "All Time" },
  ];

  // Function to dynamically set the prize text based on rangeType
  const getPrizeText = () => {
    if (rangeType === LeaderboardPeriod.All) {
      return t("season") + " " + t("prizes.title");
    } else if (rangeType === LeaderboardPeriod.Monthly) {
      const currentMonth = new Date()
        .toLocaleString("default", {
          month: "long",
        })
        .toLowerCase();
      return t(`prizes.${currentMonth}`); // e.g., "December's Prize"
    } else if (rangeType === LeaderboardPeriod.Season) {
      return t("season") + " " + t("prizes.title");
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
              {t("leaderboard")}{" "}
              {rangeType === LeaderboardPeriod.Monthly
                ? t(
                    new Date()
                      .toLocaleString("default", { month: "long" })
                      .toLowerCase(),
                  )
                : rangeType === LeaderboardPeriod.Season
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
          placeholder={t("search") + "..."}
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
