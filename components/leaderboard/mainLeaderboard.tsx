"use client";
import React, { useState, useEffect } from "react";
import HoverBorderGradient from "../ui/hoverBorderGradient";
import Image from "next/image";
import {
  SelectCompetition,
  SelectSite,
  SelectSiteReward,
  SelectUser,
} from "@/lib/schema";
import {
  getCompetitionData,
  getCompetitionFromId,
  getCompetitionsForPeriod,
  getLeaderboardData,
  getSiteRewardByDate,
  getSiteRewards,
} from "@/lib/fetchers";
import LeaderboardHeader from "./leaderboardHeader";
import Link from "next/link";
import LoadingDots from "../icons/loadingDots";
import { motion } from "framer-motion";
import { LeaderboardPeriod } from "@/lib/types";
import { Button, Spinner, User } from "@nextui-org/react";
import { Session } from "next-auth";
import RewardModal from "../rewards/rewardsModal";
import { getLeaderboardName } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type LeaderboardUser = SelectUser & { points: string; rank: string };

const MainLeaderboard = ({
  siteData,
  session,
  limit = 10,
  compDate,
  compData,
  hasEnded,
}: {
  siteData: SelectSite;
  session: Session | null;
  limit?: number;
  compDate?: Date;
  compData?: SelectCompetition;
  hasEnded?: boolean;
}) => {
  const t = useTranslations();
  const [rangeType, setRangeType] = useState<LeaderboardPeriod>(
    LeaderboardPeriod.Monthly,
  );

  const [data, setData] = useState<LeaderboardUser[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardUser[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [monthReward, setMonthReward] = useState<SelectSiteReward>();
  const [seasonReward, setSeasonReward] = useState<SelectSiteReward>();
  const [selectedReward, setSelectedReward] = useState<SelectSiteReward>();
  const [offset, setOffset] = useState(0);
  const [compTitle, setCompTitle] = useState<string>();

  const user = session?.user;

  useEffect(() => {
    const fetchRewards = async () => {
      await getModalRewards();
    };
    fetchRewards();
  }, [siteData, compData]);

  useEffect(() => {
    const fetchCompTitle = async () => {
      if (compDate != undefined || rangeType == LeaderboardPeriod.Weekly) {
        const lastWeek = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 7,
        );
        const comp = await getCompetitionsForPeriod(
          siteData.id,
          compDate || lastWeek,
          compDate || new Date(),
        );
        setCompTitle(comp[0]?.title || undefined);
      }
    };
    fetchCompTitle();
  }, [compDate, rangeType, siteData, compData]);

  useEffect(() => {
    fetchData();
    if (rangeType === LeaderboardPeriod.Season) {
      setSelectedReward(seasonReward);
    } else if (rangeType === LeaderboardPeriod.Monthly) {
      setSelectedReward(monthReward);
    } else {
      setSelectedReward(seasonReward);
    }
  }, [rangeType, siteData, compData]);

  useEffect(() => {
    if (data) {
      setFilteredData(
        data
          .filter(
            (user: LeaderboardUser) =>
              user.username?.toLowerCase().includes(query?.toLowerCase()) ||
              user.email?.toLowerCase().includes(query?.toLowerCase()) ||
              user.name?.toLowerCase().includes(query?.toLowerCase()),
          )
          .slice(offset, offset + limit),
      );
    }
  }, [query, data, offset, limit, siteData, compData]);

  const fetchData = async () => {
    setLoading(true);
    var leaderboardData;
    if (compDate) {
      leaderboardData = await getLeaderboardData(
        siteData.id,
        rangeType,
        compData?.id || rangeType,
        compDate,
        compDate,
      );
    } else {
      leaderboardData = await getLeaderboardData(
        siteData.id,
        rangeType,
        compData?.id || rangeType,
      );
    }
    setData(leaderboardData as LeaderboardUser[]);
    setLoading(false);
  };

  const getModalRewards = async () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthRew = await getSiteRewardByDate(siteData.id, month, year);
    setMonthReward(monthRew[0]);
    const seasonRew = await getSiteRewardByDate(siteData.id, -1, year);
    setSeasonReward(seasonRew[0]);
    setSelectedReward(monthRew[0]);
    console.log(monthRew, seasonRew);
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRangeType(e.target.value as LeaderboardPeriod);
  };

  const calculateBg = (index: string) => {
    try {
      const rank = parseInt(index);
      if (!compData?.correctAnswersSubmitted) return "";
      if (rank > 3) return "";
      switch (rank) {
        case 1:
          // return gold gradient dark to light
          return "linear-gradient(90deg, #FFA700 0%, #FFDF00 100%)";
        case 2:
          // return silver gradient dark to light
          return "linear-gradient(90deg, #A0A0A0 0%, #D3D3D3 100%)";
        case 3:
          // return bronze gradient dark to light
          return "linear-gradient(90deg, #CD7F32 0%, #8B4513 100%)";
        default:
          return "";
      }
    } catch (e) {
      console.error(e);
      return "";
    }
  };

  const handlePrev = () => {
    setOffset(Math.max(offset - limit, 0));
  };

  const handleNext = () => {
    setOffset(offset + limit);
  };

  return (
    <div className="container min-w-full rounded-xl">
      <LeaderboardHeader
        siteData={siteData}
        rangeType={rangeType}
        setRangeType={handleSelectionChange}
        setQuery={setQuery}
        selectedReward={selectedReward}
        onClick={() => setIsOpen(true)}
        compTitle={compTitle}
        isComp={compDate != undefined}
      />

      {/* {data && data?.findIndex((usr) => usr.id === user?.id) > -1 && (
          <div className="flex items-center gap-4 rounded-lg py-4">
            <span className="text-lg font-bold">Your Rank:</span>
            <span className="text-lg font-bold">
              {data.findIndex((usr) => usr.id === user.id) + 1}
            </span>
          </div>
        )} */}

      <div className="overflow-x-auto">
        <table className="min-w-full rounded-xl">
          <thead className="pb-4">
            <tr className="pb-4">
              <th className="py-3 text-left text-xs font-medium uppercase">
                {t("name")}
              </th>
              <th className="hidden py-3 text-center text-xs font-medium uppercase md:table-cell">
                {t("rank")}
              </th>
              <th className="text-wrap py-3 text-center text-xs font-medium uppercase">
                <span className="hidden sm:block">{t("points")}</span>
                <span className="block sm:hidden">Pts</span>
              </th>
              {compData?.slug ? (
                <th className="py-3 text-right text-xs font-medium uppercase">
                  {t("submission")}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {filteredData?.length > 0
              ? filteredData.map((entry: LeaderboardUser, index: number) => {
                  return (
                    <tr key={entry.id} className="border-b text-left">
                      <td className="flex w-[200px] items-center justify-start space-x-2 py-4 md:w-[250px] lg:w-[350px]">
                        <span className="table-cell min-w-4 pr-1 sm:hidden">
                          {entry.rank}
                        </span>

                        <div className="flex items-center space-x-2">
                          {/* Circular Image */}
                          <div className="relative h-12 w-12">
                            <Image
                              src={
                                entry.image ||
                                `https://avatar.vercel.sh/${entry.email}`
                              }
                              alt={"user image"}
                              fill
                              className="h-full w-full rounded-full object-cover"
                            />
                          </div>
                          {/* User Name */}
                          <div className="flex-1">
                            <div className="line-clamp-2 break-words">
                              {getLeaderboardName(entry)}
                              {user && user.id == entry.id && (
                                <div className="block text-sm font-bold sm:hidden">
                                  <HoverBorderGradient
                                    containerClassName="w-min"
                                    className={`hover: w-min flex-1 truncate p-1 px-2 text-sm font-bold transition-all duration-400`}
                                    color={siteData.color1}
                                  >
                                    <span style={{ color: siteData.color1 }}>
                                      You
                                    </span>
                                  </HoverBorderGradient>
                                </div>
                              )}
                            </div>
                          </div>
                          {user && user.id == entry.id && (
                            <div className="hidden text-sm font-bold sm:block">
                              <HoverBorderGradient
                                containerClassName="w-min"
                                className={`hover: w-min flex-1 truncate p-1 px-2 text-sm font-bold transition-all duration-400`}
                                color={siteData.color1}
                              >
                                <span style={{ color: siteData.color1 }}>
                                  You
                                </span>
                              </HoverBorderGradient>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="hidden py-4 text-center md:table-cell">
                        {entry.rank}
                      </td>
                      <td className="py-4 text-center">
                        {entry.points || "0"}
                      </td>
                      {compData?.slug ? (
                        <td className="justify-end py-4 text-right">
                          <Link
                            href={`/comp/${compData?.slug}/${entry.id}`}
                            className="rounded-lg bg-content3 p-2 px-4 text-sm shadow-md transition-all duration-200 hover:shadow-none"
                            style={{
                              backgroundImage: calculateBg(entry.rank),
                            }}
                          >
                            View
                          </Link>
                        </td>
                      ) : null}
                      {/* Display the points for the signed-in user */}
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
        {filteredData.length === 0 && !loading ? (
          <div className="pt-4 text-center">No data available</div>
        ) : loading ? (
          <Spinner />
        ) : null}
        <div className="mt-4 flex w-full items-center justify-end gap-2">
          {offset > 0 && (
            <Button className="" onClick={handlePrev}>
              <ArrowLeft size={16} />
            </Button>
          )}
          {filteredData?.length > 0 && (
            <Button className="" onClick={handleNext}>
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>

      <RewardModal
        reward={selectedReward}
        siteData={siteData}
        isOpen={isOpen}
        setIsOpen={setIsOpen} // Close handler
      />
    </div>
  );
};

export default MainLeaderboard;
