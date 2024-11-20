"use client";
import React, { useState, useEffect } from "react";
import HoverBorderGradient from "../ui/hoverBorderGradient";
import Image from "next/image";
import { SelectSite, SelectUser } from "@/lib/schema";
import { getLeaderboardData } from "@/lib/fetchers";
import LeaderboardHeader from "./leaderboardHeader";
import Link from "next/link";
import LoadingDots from "../icons/loadingDots";
import { motion } from "framer-motion";

type LeaderboardUser = SelectUser & { points: number };

const MainLeaderboard = ({
  siteData,
  user,
}: {
  siteData: SelectSite;
  user: SelectUser;
}) => {
  const [rangeType, setRangeType] = useState<
    "last week" | "monthly" | "season" | "all time"
  >("all time");

  const [data, setData] = useState<LeaderboardUser[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardUser[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const leaderboardData = await getLeaderboardData(siteData.id, rangeType);
      setData(leaderboardData! as LeaderboardUser[]);
      setLoading(false);
    };
    fetchData();
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
    <div className="rounded-x container min-w-full text-white">
      <LeaderboardHeader
        siteData={siteData}
        rangeType={rangeType}
        setRangeType={setRangeType}
        setQuery={setQuery}
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
            {filteredData?.length > 0 ? (
              // Create a new array to include the signed-in user at the top
              [user, ...filteredData].map((entry: any, index: number) => {
                // Check if the current entry is the signed-in user
                if (user && entry.id === user.id) {
                  // For the first instance (at the top)
                  if (index === 0) {
                    return;
                    // return (
                    //   <tr key={entry.id} className="border-b text-left">
                    //     <td className="flex w-[200px] items-center justify-start space-x-2 py-4 md:w-[250px] lg:w-[350px]">
                    //       <div className="table-cell pr-1 sm:hidden">1</div>
                    //       <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
                    //         <Image
                    //           src={
                    //             entry.image ||
                    //             `https://avatar.vercel.sh/${entry.email}`
                    //           }
                    //           alt="Profile"
                    //           fill={true}
                    //           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    //           className="overflow-hidden rounded-full object-cover"
                    //         />
                    //       </div>
                    //       <div className="flex w-0 flex-1 items-center text-sm font-bold">
                    //         <span className="truncate">
                    //           @
                    //           {entry.username ||
                    //             entry.email ||
                    //             entry.name ||
                    //             "User"}
                    //         </span>
                    //         <HoverBorderGradient
                    //           containerClassName="ml-2 mr-auto w-min"
                    //           className={`duration-400 w-min flex-1 truncate p-1 px-2 text-sm font-bold transition-all hover:bg-slate-900`}
                    //           color={siteData.color1}
                    //         >
                    //           <span style={{ color: siteData.color1 }}>
                    //             You
                    //           </span>
                    //         </HoverBorderGradient>
                    //       </div>
                    //     </td>
                    //     <td className="hidden py-4 text-center md:table-cell">
                    //       {filteredData.findIndex(
                    //         (usr) => usr.id === user.id,
                    //       ) + 1}
                    //     </td>
                    //     <td className="py-4 text-center">
                    //       {parseFloat(entry.points || "0").toFixed(2)}
                    //     </td>
                    //     {/* Display the points for the signed-in user */}
                    //   </tr>
                    // );
                  } else {
                    // For the second instance (where they appear in their actual position)
                    return (
                      <tr key={entry.id} className="border-b text-left">
                        <td className="flex w-[200px] items-center justify-start space-x-2 py-4 md:w-[250px] lg:w-[350px]">
                          <div className="table-cell pr-1 sm:hidden">1</div>
                          <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
                            <Image
                              src={
                                entry.image ||
                                `https://avatar.vercel.sh/${entry.email}`
                              }
                              alt="Profile"
                              fill={true}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="overflow-hidden rounded-full object-cover"
                            />
                          </div>
                          <div className="flex w-0 flex-1 items-center text-sm font-bold">
                            <span className="truncate">
                              @
                              {entry.username ||
                                entry.email ||
                                entry.name ||
                                "User"}
                            </span>
                            <HoverBorderGradient
                              containerClassName="ml-2 mr-auto w-min"
                              className={`duration-400 w-min flex-1 truncate p-1 px-2 text-sm font-bold transition-all hover:bg-slate-900`}
                              color={siteData.color1}
                            >
                              <span style={{ color: siteData.color1 }}>
                                You
                              </span>
                            </HoverBorderGradient>
                          </div>
                        </td>
                        <td className="hidden py-4 text-center md:table-cell">
                          {filteredData.findIndex((usr) => usr.id === user.id) +
                            1}
                        </td>
                        <td className="py-4 text-center">
                          {parseFloat(entry.points || "0").toFixed(2)}
                        </td>
                        {/* Display the points for the signed-in user */}
                      </tr>
                    );
                  }
                } else if (index > 0) {
                  // Render the row for other users
                  return (
                    <tr key={entry.id} className="border-b text-left">
                      <td className="flex w-[150px] items-center space-x-2 py-4 md:w-[200px] lg:w-[300px]">
                        <div className="table-cell pr-1 sm:hidden">{index}</div>
                        <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
                          <Image
                            src={
                              entry.image ||
                              `https://avatar.vercel.sh/${entry.email}`
                            }
                            alt="Profile"
                            fill={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="overflow-hidden rounded-full object-cover"
                          />
                        </div>
                        <span className="ml-2 w-0 flex-1 truncate text-sm font-bold">
                          @
                          {entry.username ||
                            entry.email ||
                            entry.name ||
                            "User"}
                        </span>
                      </td>
                      <td className="hidden py-4 text-center md:table-cell">
                        {index}
                      </td>
                      <td className="py-4 text-center">
                        {parseFloat(entry.points || "0").toFixed(2)}
                      </td>
                      {/* Display points for the other user */}
                    </tr>
                  );
                }
              })
            ) : loading ? (
              <LoadingDots color="gray" />
            ) : null}
          </tbody>
        </table>
        {filteredData.length === 0 && !loading && (
          <div className="pt-4 text-center">No data available</div>
        )}
      </div>
    </div>
  );
};

export default MainLeaderboard;
