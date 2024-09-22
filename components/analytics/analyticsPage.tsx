import React from "react";
import StatsBadges from "@/components/analytics/statsBadges";
import EngagementTime from "@/components/analytics/engagementTime";
import EngagementTraffic from "@/components/analytics/engagementTraffic";
import VoucherConversions from "@/components/analytics/voucherConversions";
import Retention from "@/components/analytics/retention";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="">
      <div className="italic">
        This dashboard is for demo purposes: Start publishing competitions to
        see your analytics!
      </div>
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
