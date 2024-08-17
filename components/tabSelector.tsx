"use client";

import { useState } from "react";

const TabSelector = () => {
  const [activeTab, setActiveTab] = useState("Challenge");

  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <div className="flex w-full border-b-2">
        {["Challenge", "Rewards", "Leaderboard"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full pb-4 text-xl font-normal ${
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
