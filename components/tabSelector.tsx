"use client";

import { useState } from "react";

const TabSelector = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: any;
}) => {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center bg-white p-8 md:w-3/4 md:p-14 lg:w-3/5">
      <div className="flex w-full border-b-2">
        {["Challenge", "Rewards", "Leaderboard"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full pb-4 font-normal md:text-xl ${
              activeTab === tab
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabSelector;
