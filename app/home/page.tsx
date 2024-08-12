import FanZone from "@/components/fanZone";
import GuessScore from "@/components/questions/guessScore";
import MatchOutcome from "@/components/questions/matchOutcome";
import PlayerGoals from "@/components/questions/playerGoals";
import PlayerSelection from "@/components/questions/playerSelection";
import TrueFalse from "@/components/questions/trueFalse";
import WhatMinute from "@/components/questions/whatMinute";

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-12 bg-green-100 p-8">
      <h1 className="text-2xl font-bold">Component Showcase</h1>
      <TrueFalse />
      <WhatMinute />
      <MatchOutcome />
      <GuessScore />
      <PlayerGoals />
      <PlayerSelection />
    </div>
  );
}
