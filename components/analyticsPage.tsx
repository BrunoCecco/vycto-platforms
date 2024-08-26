import React from "react";
import StatsBadges from "./analytics/statsBadges";
import EngagementTime from "./analytics/engagementTime";
import EngagementTraffic from "./analytics/engagementTraffic";
import VoucherConversions from "./analytics/voucherConversions";
import Retention from "./analytics/retention";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="">
      <StatsBadges />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <EngagementTime />
        <EngagementTraffic />
        <Retention />
        <VoucherConversions />
      </div>
    </div>
  );
};

export default AnalyticsPage;
