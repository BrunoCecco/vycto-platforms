"use client";
import AdminPage from "@/components/adminPage";
import AnalyticsPage from "@/components/analyticsPage";
import B2BSignUp from "@/components/b2BSignUp";
import PoweredBadge from "@/components/poweredBadge";
import SelectUsername from "@/components/selectUsername";
import UserSignUp from "@/components/userSignUp";

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-12 bg-green-100">
      <h1 className="text-2xl font-bold">Development Playground</h1>
      <AdminPage />
      {/* <Rewards />  */}
      <AnalyticsPage />
      <PoweredBadge />
      <B2BSignUp />
      <UserSignUp />
      <SelectUsername />
    </div>
  );
}
