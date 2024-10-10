import React from "react";
import Image from "next/image";
import {
  SelectCompetition,
  SelectSite,
  SelectUser,
  SelectUserCompetition,
} from "@/lib/schema";
import Link from "next/link";

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
    <div className="container mt-2 w-full">
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="hidden min-w-full md:table">
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
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, index: number) => (
              <tr key={user.userId} className="border-b text-left">
                <td className="flex items-center space-x-3 py-4">
                  <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
                    <Image
                      src={
                        user.image || `https://avatar.vercel.sh/${user.email}`
                      }
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
                <td className="hidden py-4 sm:table-cell">
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
                  <span className="ml-2 font-bold text-gray-900">
                    @
                    {(user.username || "User").length > 10
                      ? `${(user.username || "User").slice(0, 10)}...`
                      : user.username || "User" + index}
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
