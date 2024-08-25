import React from "react";
import StatsBadges from "./analytics/statsBadges";
import EngagementTime from "./analytics/engagementTime";
import EngagementTraffic from "./analytics/engagementTraffic";
import VoucherConversions from "./analytics/voucherConversions";
import Retention from "./analytics/retention";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="pl-4 text-2xl font-bold">Analytics</h1>
      <StatsBadges />
      <div className="flex space-x-8 p-4">
        <EngagementTime />
        <EngagementTraffic />
      </div>
      <div className="flex space-x-8 p-4">
        <Retention />
        <VoucherConversions />
      </div>
    </div>
  );
};

export default AnalyticsPage;
