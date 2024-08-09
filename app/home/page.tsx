import CompetitionCard from "@/components/competitionCard";
import CurrentCompetitions from "@/components/currentCompetitions";
import { InlineSnippet } from "@/components/form/domain-configuration";
import Leaderboard from "@/components/leaderboard";
import PastCompetitions from "@/components/pastCompetitions";
import TrueFalse from "@/components/questions/trueFalse";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-12 bg-green-100 p-8">
      <h1 className="text-2xl font-bold">Component Showcase</h1>
      <CurrentCompetitions />
      <PastCompetitions />
      <Leaderboard />
      <TrueFalse />
    </div>
  );
}
