"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const TabSelector = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: any;
}) => {
  console.log("activeTab", activeTab);
  const t = useTranslations();
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center">
      <div className="flex w-full overflow-hidden border-b-2">
        {[t("challenge"), t("rewards"), t("leaderboard")].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full py-4 font-normal md:text-xl ${
              activeTab === tab
                ? "border-b-2 border-success-600 text-success-600"
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
