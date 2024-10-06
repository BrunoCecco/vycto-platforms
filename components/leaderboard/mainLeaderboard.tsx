"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SelectSite, SelectUser } from "@/lib/schema";
import { getLeaderboardData } from "@/lib/fetchers";
import LeaderboardHeader from "./leaderboardHeader";
import { getSession } from "@/lib/auth";

type LeaderboardUser = SelectUser & { points: number };

const MainLeaderboard = ({
  siteData,
  user,
}: {
  siteData: SelectSite;
  user: SelectUser;
}) => {
  const [rangeType, setRangeType] = useState<"yearly" | "monthly" | "all time">(
    "all time",
  );

  const [data, setData] = useState<LeaderboardUser[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardUser[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const leaderboardData = await getLeaderboardData(siteData.id, rangeType);
      setData(leaderboardData! as LeaderboardUser[]);
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

  return (
    filteredData && (
      <div className="container min-w-full rounded-xl">
        <LeaderboardHeader
          siteData={siteData}
          rangeType={rangeType}
          setRangeType={setRangeType}
          setQuery={setQuery}
        />

        {data?.findIndex((usr) => usr.id === user.id) > -1 && (
          <div className="flex items-center gap-4 rounded-lg py-4">
            <span className="text-lg font-bold">Your Rank:</span>
            <span className="text-lg font-bold">
              {data.findIndex((usr) => usr.id === user.id) + 1}
            </span>
          </div>
        )}

        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="hidden min-w-full rounded-xl md:table">
            <thead className="pb-4">
              <tr className="pb-4">
                <th className="order-2 py-3 text-left text-xs font-medium uppercase">
                  Name
                </th>
                <th className="order-1 py-3 text-left text-xs font-medium uppercase">
                  Rank
                </th>
                <th className="order-3 text-wrap py-3 text-left text-xs font-medium uppercase">
                  Points
                </th>
                <th className="order-5 py-3 text-left text-xs font-medium uppercase">
                  Rank
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.length > 0 ? (
                filteredData.map((user: any, index: number) => (
                  <tr key={user.userId} className="border-b text-left">
                    <td className="flex items-center space-x-3 py-4">
                      <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
                        <Image
                          src={
                            user.image ||
                            `https://avatar.vercel.sh/${user.email}`
                          }
                          alt="Profile"
                          fill={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="overflow-hidden rounded-full object-cover"
                        />
                      </div>
                      <span className="font-bold">
                        @{user.username || user.email || user.name || "User"}
                      </span>
                    </td>
                    <td className="py-4">{index + 1}</td>
                    <td className="py-4">
                      {parseFloat(user.points || "0").toFixed(2)}
                    </td>
                    <td className="py-4">
                      <div
                        className="my-auto flex h-2 items-center justify-center rounded-full bg-purple-800 text-white"
                        style={{ width: 100 - index + 1 + "%" }}
                      ></div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="pt-4 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile Table */}
          <table className="min-w-full rounded-xl md:hidden">
            {filteredData?.length > 0 ? (
              <>
                <thead className="pb-4">
                  <tr className="pb-4">
                    <th className="py-3 text-left text-xs font-medium uppercase"></th>
                    <th className="py-3 text-left text-xs font-medium uppercase">
                      Name
                    </th>
                    <th className="text-wrap py-3 text-left text-xs font-medium uppercase">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((user: any, index: number) => (
                    <tr key={user.userId} className="border-b">
                      <td className="pr-2">{index + 1}</td>
                      <td className="flex items-center py-4">
                        <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
                          <Image
                            src={
                              user.image ||
                              `https://avatar.vercel.sh/${user.username}`
                            }
                            alt="Profile"
                            fill={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="overflow-hidden rounded-full object-cover"
                          />
                        </div>
                        <span className="ml-2 font-bold">
                          @{user.username || "User" + index}
                        </span>
                      </td>
                      <td className="py-4">
                        {parseFloat(user.points || "0").toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <tbody>
                <tr>
                  <td className="pt-4 text-center" colSpan={3}>
                    No data available
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    )
  );
};

export default MainLeaderboard;
