import React from "react";
import Image from "next/image";
import {
  SelectCompetition,
  SelectSite,
  SelectUser,
  SelectUserCompetition,
} from "@/lib/schema";
import Link from "next/link";
import HoverBorderGradient from "../ui/hoverBorderGradient";
import { User } from "@nextui-org/react";

const Leaderboard = ({
  siteData,
  competition,
  users,
  session,
}: {
  siteData: SelectSite;
  competition: SelectCompetition;
  users: SelectUserCompetition[];
  session: any;
}) => {
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
    <div className="container mt-2 w-full">
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="min-w-full table-auto border-separate sm:border-spacing-x-2">
          <thead className="pb-4">
            <tr className="pb-4">
              <th className="order-2 py-3 text-left text-xs font-medium uppercase ">
                Name
              </th>
              <th className="order-1 hidden py-3 text-center text-xs font-medium uppercase  sm:table-cell">
                Rank
              </th>
              <th className="order-3 text-wrap py-3 text-center text-xs font-medium uppercase ">
                <span className="hidden sm:block">Points</span>
                <span className="block sm:hidden">Pts</span>
              </th>
              <th className="order-4 py-3 text-right text-xs font-medium uppercase  sm:table-cell">
                Submission
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, index: number) => {
              return (
                <tr
                  key={user.userId}
                  className="relative w-full columns-12 border-b text-left"
                >
                  <td className="flex w-[200px] items-center justify-start space-x-2 py-4 md:w-[250px] lg:w-[350px]">
                    <span className="table-cell pr-1 sm:hidden">
                      {index + 1}
                    </span>
                    <User
                      name={user.username || user.name || user.email || "User"}
                      avatarProps={{
                        src:
                          user.image ||
                          `https://avatar.vercel.sh/${user.email}`,
                      }}
                    />
                    {session && session.user.id === user.userId ? (
                      <div className="flex w-0 flex-1 items-center text-sm font-bold">
                        <HoverBorderGradient
                          containerClassName="ml-2 mr-auto w-min"
                          className={`w-min flex-1 truncate p-1 px-2 text-sm font-bold transition-all duration-400`}
                          color={siteData.color1}
                        >
                          <span style={{ color: siteData.color1 }}>You</span>
                        </HoverBorderGradient>
                      </div>
                    ) : null}
                  </td>
                  <td className="hidden py-4 text-center sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="py-4 text-center text-sm">
                    {parseFloat(user.points || "0").toFixed(2)}
                  </td>
                  <td className="justify-end py-4 text-right">
                    <Link
                      href={`/comp/${competition.slug}/${user.userId}`}
                      className="bg-blue-100 text-purple-800 hover:bg-blue-300 rounded-lg p-2 px-4 text-sm shadow-md transition-all duration-200 hover:shadow-none"
                      style={{
                        backgroundImage: calculateBg(index),
                        color: "black",
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
