import CurrentCompetitions from "@/components/currentCompetitions";
import Leaderboard from "@/components/leaderboard";
import PastCompetitions from "@/components/pastCompetitions";
import MatchOutcome from "@/components/questions/matchOutcome";
import TrueFalse from "@/components/questions/trueFalse";
import WhatMinute from "@/components/questions/whatMinute";

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-12 bg-green-100 p-8">
      <h1 className="text-2xl font-bold">Component Showcase</h1>
      <CurrentCompetitions />
      <PastCompetitions />
      <Leaderboard />
      <TrueFalse />
      <WhatMinute />
      <MatchOutcome />
    </div>
  );
}
