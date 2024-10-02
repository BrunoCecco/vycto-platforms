"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SelectSite } from "@/lib/schema";
import {
  getMonthlyLeaderboardData,
  getYearlyLeaderboardData,
} from "@/lib/fetchers";

const MainLeaderboard = ({ siteData }: { siteData: SelectSite }) => {
  const [rangeType, setRangeType] = useState("yearly");

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (rangeType === "monthly") {
        const monthData = await getMonthlyLeaderboardData(siteData.id);
        setData(monthData);
      } else {
        console.log("Yearly");
        const yearData = await getYearlyLeaderboardData(siteData.id);
        console.log(yearData);
        setData(yearData);
      }
    };
    fetchData();
  }, [rangeType]);

  return (
    data && (
      <div className="container min-w-full rounded-xl bg-white px-2 py-4 md:p-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row md:items-center md:py-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Image
              src={siteData.logo || "/logo.png"}
              alt="Brand Logo"
              width={80}
              height={80}
              className="object-contain"
            />
            <h1 className="text-lg font-bold text-gray-800 md:text-2xl">
              Leaderboard -{" "}
              {rangeType == "monthly"
                ? new Date().toLocaleString("default", { month: "long" })
                : new Date().getFullYear()}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setRangeType("monthly")}
              className={`rounded-md px-4 py-2`}
              style={{
                backgroundColor: siteData.color2,
                opacity: rangeType === "monthly" ? 1 : 0.5,
                color: "white",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setRangeType("yearly")}
              className={`rounded-md px-4 py-2`}
              style={{
                backgroundColor: siteData.color2,
                opacity: rangeType === "yearly" ? 1 : 0.5,
                color: "white",
              }}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="hidden min-w-full rounded-xl md:table">
            <thead className="pb-4">
              <tr className="pb-4">
                <th className="order-2 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Name
                </th>
                <th className="order-1 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Rank
                </th>
                <th className="order-3 text-wrap py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Points
                </th>
                <th className="order-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Rank
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((user: any, index: number) => (
                  <tr key={user.userId} className="border-b text-left">
                    <td className="flex items-center space-x-3 py-4">
                      <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
                        <Image
                          src={`https://avatar.vercel.sh/${user.email}`}
                          alt="Profile"
                          fill={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="overflow-hidden rounded-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-gray-900">
                        @{user.username || user.email || user.name || "User"}
                      </span>
                    </td>
                    <td className="py-4 text-gray-900">{index + 1}</td>
                    <td className="py-4 text-gray-900">
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
                  <td className="pt-4 text-center text-gray-900">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile Table */}
          <table className="min-w-full rounded-xl md:hidden">
            {data?.length > 0 ? (
              <>
                <thead className="pb-4">
                  <tr className="pb-4">
                    <th className="py-3 text-left text-xs font-medium uppercase text-gray-500"></th>
                    <th className="py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Name
                    </th>
                    <th className="text-wrap py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user: any, index: number) => (
                    <tr key={user.userId} className="border-b">
                      <td className="pr-2 text-gray-900">{index + 1}</td>
                      <td className="flex items-center py-4">
                        <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
                          <Image
                            src={`https://avatar.vercel.sh/${user.username}`}
                            alt="Profile"
                            fill={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="overflow-hidden rounded-full object-cover"
                          />
                        </div>
                        <span className="ml-2 font-bold text-gray-900">
                          @{user.username || "User" + index}
                        </span>
                      </td>
                      <td className="py-4 text-gray-900">
                        {parseFloat(user.points || "0").toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <tbody>
                <tr>
                  <td className="pt-4 text-center text-gray-900" colSpan={3}>
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
