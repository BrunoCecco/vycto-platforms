import React from "react";
import Image from "next/image";

const leaderboardData = [
  {
    id: 1,
    name: "john_doe",
    profilePic: "/logo.png", // Replace with actual image URL
    rank: 1,
    totalPoints: 1500,
    latestSubmission: "View",
  },
  {
    id: 2,
    name: "john_doe",
    profilePic: "/logo.png",
    rank: 2,
    totalPoints: 1400,
    latestSubmission: "View",
  },
  {
    id: 3,
    name: "john_doe",
    profilePic: "/logo.png",
    rank: 2,
    totalPoints: 1100,
    latestSubmission: "View",
  },
];

const Leaderboard = () => {
  return (
    <div className="container mx-auto border border-gray-200 bg-white p-4">
      <div className="flex w-full flex-col-reverse justify-between gap-4 p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Brand Logo"
            width={40}
            height={40}
            className="overflow-hidden rounded-full"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Leaderboard - August 2024
          </h1>
        </div>
        <button className="w-24 rounded-full bg-blue-100 p-2 text-purple-800 hover:bg-blue-300">
          View
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-xl">
          <thead className="pb-4">
            <tr className="pb-4">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Total Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Last Submission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Rank
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="flex items-center space-x-3 px-6 py-4">
                  <Image
                    className="rounded-full"
                    src={user.profilePic}
                    alt="Profile"
                    width={40}
                    height={40}
                  />
                  <span className="font-bold text-gray-900">@{user.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-900">{user.rank}</td>
                <td className="px-6 py-4 text-gray-900">{user.totalPoints}</td>
                <td className="px-6 py-4">
                  <button className="w-24 rounded-full bg-blue-100 p-2 text-purple-800 hover:bg-blue-300">
                    View
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div
                    className="flex h-2 items-center justify-center rounded-full bg-purple-800 text-white"
                    style={{ width: 100 - user.rank + "%" }}
                  ></div>
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
