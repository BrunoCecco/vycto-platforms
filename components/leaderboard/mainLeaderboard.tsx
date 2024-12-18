"use client";
import React, { useState, useEffect } from "react";
import HoverBorderGradient from "../ui/hoverBorderGradient";
import Image from "next/image";
import { SelectSite, SelectSiteReward, SelectUser } from "@/lib/schema";
import {
  getLeaderboardData,
  getSiteRewardByDate,
  getSiteRewards,
} from "@/lib/fetchers";
import LeaderboardHeader from "./leaderboardHeader";
import Link from "next/link";
import LoadingDots from "../icons/loadingDots";
import { motion } from "framer-motion";
import { LeaderboardPeriod } from "@/lib/types";
import { Spinner, User } from "@nextui-org/react";
import { Session } from "next-auth";
import RewardModal from "../rewards/rewardsModal";

type LeaderboardUser = SelectUser & { points: number };
type IRangeType = "last week" | "monthly" | "season" | "all time";

const MainLeaderboard = ({
  siteData,
  session,
}: {
  siteData: SelectSite;
  session: Session | null;
}) => {
  const [rangeType, setRangeType] = useState<IRangeType>("all time");

  const [data, setData] = useState<LeaderboardUser[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardUser[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [monthReward, setMonthReward] = useState<SelectSiteReward>();
  const [seasonReward, setSeasonReward] = useState<SelectSiteReward>();
  const [selectedReward, setSelectedReward] = useState<SelectSiteReward>();

  const user = session?.user;

  useEffect(() => {
    const fetchRewards = async () => {
      await getModalRewards();
    };
    fetchRewards();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const leaderboardData = await getLeaderboardData(siteData.id, rangeType);
      setData(leaderboardData! as LeaderboardUser[]);
      setLoading(false);
    };
    fetchData();
    if (rangeType === "season") {
      setSelectedReward(seasonReward);
    } else if (rangeType === "monthly") {
      setSelectedReward(monthReward);
    } else {
      setSelectedReward(seasonReward);
    }
  }, [rangeType]);

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter(
          (user: LeaderboardUser) =>
            user.username?.toLowerCase().includes(query?.toLowerCase()) ||
            user.email?.toLowerCase().includes(query?.toLowerCase()) ||
            user.name?.toLowerCase().includes(query?.toLowerCase()),
        ),
      );
    }
  }, [query, data]);

  const getModalRewards = async () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthRew = await getSiteRewardByDate(siteData.id, month, year);
    setMonthReward(monthRew[0]);
    const seasonRew = await getSiteRewardByDate(siteData.id, -1, year);
    setSeasonReward(seasonRew[0]);
    setSelectedReward(monthRew[0]);
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRangeType(e.target.value as LeaderboardPeriod);
  };

  const calculateBg = (index: number) => {
    if (index > 2) return "";
    switch (index) {
      case 0:
        // return gold gradient dark to light
        return "linear-gradient(90deg, #FFA700 0%, #FFDF00 100%)";
      case 1:
        // return silver gradient dark to light
        return "linear-gradient(90deg, #A0A0A0 0%, #D3D3D3 100%)";
      case 2:
        // return bronze gradient dark to light
        return "linear-gradient(90deg, #CD7F32 0%, #8B4513 100%)";
      default:
        return "";
    }
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
                Name
              </th>
              <th className="hidden py-3 text-center text-xs font-medium uppercase md:table-cell">
                Rank
              </th>
              <th className="text-wrap py-3 text-center text-xs font-medium uppercase">
                <span className="hidden sm:block">Points</span>
                <span className="block sm:hidden">Pts</span>
              </th>
              {/* <th className="py-3 text-right text-xs font-medium uppercase">
                  Submissions
                </th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData?.length > 0
              ? filteredData.map((entry: LeaderboardUser, index: number) => {
                  return (
                    <tr key={entry.id} className="border-b text-left">
                      <td className="flex w-[200px] items-center justify-start space-x-2 py-4 md:w-[250px] lg:w-[350px]">
                        <span className="table-cell min-w-4 pr-1 sm:hidden">
                          {filteredData.findIndex(
                            (usr) => usr.id === entry.id,
                          ) + 1}
                        </span>
                        <User
                          name={
                            entry.username ||
                            entry.name ||
                            entry.email ||
                            "User"
                          }
                          avatarProps={{
                            src:
                              entry.image ||
                              `https://avatar.vercel.sh/${entry.email}`,
                          }}
                        />
                        {user && user.id == entry.id ? (
                          <div className="flex w-0 flex-1 items-center text-sm font-bold">
                            <HoverBorderGradient
                              containerClassName="ml-2 mr-auto w-min"
                              className={`hover: w-min flex-1 truncate p-1 px-2 text-sm font-bold transition-all duration-400`}
                              color={siteData.color1}
                            >
                              <span style={{ color: siteData.color1 }}>
                                You
                              </span>
                            </HoverBorderGradient>
                          </div>
                        ) : null}
                      </td>
                      <td className="hidden py-4 text-center md:table-cell">
                        {filteredData.findIndex((usr) => usr.id === entry.id) +
                          1}
                      </td>
                      <td className="py-4 text-center">
                        {parseFloat(entry.points.toString() || "0").toFixed(2)}
                      </td>
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
