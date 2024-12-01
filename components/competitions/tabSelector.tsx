"use client";

import { useState } from "react";

const TabSelector = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: any;
}) => {
  console.log("activeTab", activeTab);
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center">
      <div className="flex w-full overflow-hidden border-b-2">
        {["Challenge", "Rewards", "Leaderboard"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full py-4 font-normal md:text-xl ${
              activeTab === tab
                ? "border-b-2 border-green-600 text-green-600"
                : ""
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
