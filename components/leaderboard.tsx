import React from "react";
import Image from "next/image";
import {
  SelectCompetition,
  SelectSite,
  SelectUser,
  SelectUserCompetition,
} from "@/lib/schema";
import Link from "next/link";

const leaderboardData = [
  {
    id: 1,
    name: "john_doe",
    profilePic: "/logo.png", // Replace with actual image URL
    rank: 1,
    points: 1000,
    latestSubmission: "View",
  },
  {
    id: 2,
    name: "garry_123",
    profilePic: "/logo.png",
    rank: 2,
    points: 700,
    latestSubmission: "View",
  },
  {
    id: 3,
    name: "timotheeee",
    profilePic: "/logo.png",
    points: 300,
    rank: 3,
    latestSubmission: "View",
  },
];

const Leaderboard = ({
  siteData,
  competition,
  users,
}: {
  siteData: SelectSite;
  competition: SelectCompetition;
  users: SelectUserCompetition[];
}) => {
  return (
    <div className="container w-full bg-white px-2 py-6 md:rounded-2xl md:p-8">
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row md:items-center md:py-6">
        <div className="flex items-center justify-center gap-4 md:justify-normal">
          <div className="relative inline-block h-16 w-32 align-middle md:h-16 md:w-36">
            <Image
              src={siteData.logo || "/logo.png"}
              alt="Brand Logo"
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              objectFit="contain"
            />
          </div>
          <h1 className="text-lg font-bold text-gray-800 md:text-2xl">
            Leaderboard
          </h1>
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
              <th className="order-4 hidden py-3 text-left text-xs font-medium uppercase text-gray-500 sm:table-cell">
                Submission
              </th>
              <th className="order-5 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Rank
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, index: number) => (
              <tr key={user.userId} className="border-b text-left">
                <td className="flex items-center space-x-3 py-4">
                  <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
                    <Image
                      src={
                        user.image ?? `https://avatar.vercel.sh/${user.email}`
                      }
                      alt="Profile"
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      objectFit="cover"
                      className="overflow-hidden rounded-full"
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
                <td className="hidden py-4 sm:table-cell">
                  <Link
                    href={`/comp/${competition.slug}/${user.userId}`}
                    className="rounded-full bg-blue-100 p-2 px-4 text-purple-800 hover:bg-blue-300"
                  >
                    View
                  </Link>
                </td>
                <td className="py-4">
                  <div
                    className="my-auto flex h-2 items-center justify-center rounded-full bg-purple-800 text-white"
                    style={{ width: 100 - index + 1 + "%" }}
                  ></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Table */}
        <table className="min-w-full rounded-xl md:hidden">
          <thead className="pb-4">
            <tr className="pb-4">
              <th className="py-3 text-left text-xs font-medium uppercase text-gray-500"></th>
              <th className="py-3 text-left text-xs font-medium uppercase text-gray-500">
                Name
              </th>
              <th className="text-wrap py-3 text-left text-xs font-medium uppercase text-gray-500">
                Points
              </th>
              <th className="py-3 text-left text-xs font-medium uppercase text-gray-500">
                Submission
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index: number) => (
              <tr key={user.userId} className="border-b">
                <td className="pr-2 text-gray-900">{index + 1}</td>
                <td className="flex items-center py-4">
                  <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
                    <Image
                      src={`https://avatar.vercel.sh/${user.username}`}
                      alt="Profile"
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      objectFit="cover"
                      className="overflow-hidden rounded-full"
                    />
                  </div>
                  <span className="ml-2 font-bold text-gray-900">
                    @{user.username || "User"}
                  </span>
                </td>
                <td className="py-4 text-gray-900">
                  {parseFloat(user.points || "0").toFixed(2)}
                </td>
                <td className="py-4">
                  <Link
                    href={`/comp/${competition.slug}/${user.userId}`}
                    className="rounded-full bg-blue-100 p-2 px-4 text-purple-800 hover:bg-blue-300"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
