"use client";
import EditGuessScore from "@/components/edit-questions/editGuessScore";
import EditMatchOutcome from "@/components/edit-questions/editMatchOutcome";
import EditGeneralSelection from "@/components/edit-questions/editGeneralSelection";
import EditPlayerSelection from "@/components/edit-questions/editPlayerSelection";
import GameStats from "@/components/gameStats";
import QuestionBuilder from "@/components/questionBuilder";
import GuessScore from "@/components/questions/guessScore";
import MatchOutcome from "@/components/questions/matchOutcome";
import GeneralSelection from "@/components/questions/generalSelection";
import PlayerSelection from "@/components/questions/playerSelection";
import WhatMinute from "@/components/questions/whatMinute";
import SelectUsername from "@/components/selectUsername";
import UserSignUp from "@/components/userSignUp";
import B2BSignUp from "@/components/b2BSignUp";
import PoweredBadge from "@/components/poweredBadge";
import AnalyticsPage from "@/components/analyticsPage";
import Rewards from "@/components/rewards";
import AdminTable from "@/components/adminTable";

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-12 bg-green-100">
      <h1 className="text-2xl font-bold">Development Playground</h1>
      <div className="pl-32">
        <AdminTable />
      </div>
      {/* <Rewards />  */}
      <AnalyticsPage />
      <PoweredBadge />
      <B2BSignUp />
      <UserSignUp />
      <SelectUsername />
    </div>
  );
}
